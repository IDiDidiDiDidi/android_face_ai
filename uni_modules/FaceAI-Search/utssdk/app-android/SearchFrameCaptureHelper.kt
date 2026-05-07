package uts.sdk.modules.uniFaceAISDK

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.graphics.Rect
import android.graphics.YuvImage
import androidx.camera.core.ImageProxy
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer

object SearchFrameCaptureHelper {
    private const val CAPTURE_DIR_NAME = "SearchCapture"

    fun saveImageProxyAsJpeg(context: Context, imageProxy: ImageProxy, captureAt: Long): String? {
        return try {
            val bitmap = imageProxyToBitmap(imageProxy) ?: return null
            val rotatedBitmap = rotateBitmap(bitmap, imageProxy.imageInfo.rotationDegrees)
            val captureDir = File(context.filesDir, "FaceAI/$CAPTURE_DIR_NAME")
            if (!captureDir.exists() && !captureDir.mkdirs()) {
                rotatedBitmap.recycle()
                if (rotatedBitmap !== bitmap) {
                    bitmap.recycle()
                }
                return null
            }

            val outputFile = File(captureDir, "pre_compare_${captureAt}.jpg")
            FileOutputStream(outputFile).use { stream ->
                rotatedBitmap.compress(Bitmap.CompressFormat.JPEG, 92, stream)
                stream.flush()
            }

            rotatedBitmap.recycle()
            if (rotatedBitmap !== bitmap) {
                bitmap.recycle()
            }
            outputFile.absolutePath
        } catch (e: Exception) {
            null
        }
    }

    private fun imageProxyToBitmap(imageProxy: ImageProxy): Bitmap? {
        if (imageProxy.format != ImageFormat.YUV_420_888) {
            return null
        }

        val nv21 = yuv420888ToNv21(imageProxy)
        if (nv21.isEmpty()) {
            return null
        }
        val yuvImage = YuvImage(nv21, ImageFormat.NV21, imageProxy.width, imageProxy.height, null)
        val jpegStream = ByteArrayOutputStream()
        val compressed = yuvImage.compressToJpeg(
            Rect(0, 0, imageProxy.width, imageProxy.height),
            95,
            jpegStream
        )
        if (!compressed) {
            return null
        }

        val jpegBytes = jpegStream.toByteArray()
        return BitmapFactory.decodeByteArray(jpegBytes, 0, jpegBytes.size)
    }

    private fun rotateBitmap(bitmap: Bitmap, rotationDegrees: Int): Bitmap {
        if (rotationDegrees == 0) {
            return bitmap
        }

        val matrix = Matrix()
        matrix.postRotate(rotationDegrees.toFloat())
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }

    private fun yuv420888ToNv21(imageProxy: ImageProxy): ByteArray {
        val image = imageProxy.image ?: return ByteArray(0)
        val planes = image.planes
        if (planes.size < 3) {
            return ByteArray(0)
        }
        val ySize = image.width * image.height
        val uvSize = image.width * image.height / 4
        val nv21 = ByteArray(ySize + uvSize * 2)

        unpackPlane(planes[0].buffer, image.width, image.height, planes[0].rowStride, planes[0].pixelStride, nv21, 0, 1)
        unpackPlane(planes[2].buffer, image.width / 2, image.height / 2, planes[2].rowStride, planes[2].pixelStride, nv21, ySize, 2)
        unpackPlane(planes[1].buffer, image.width / 2, image.height / 2, planes[1].rowStride, planes[1].pixelStride, nv21, ySize + 1, 2)

        return nv21
    }

    private fun unpackPlane(
        buffer: ByteBuffer,
        width: Int,
        height: Int,
        rowStride: Int,
        pixelStride: Int,
        out: ByteArray,
        offset: Int,
        outputStride: Int
    ) {
        val rowData = ByteArray(rowStride)
        var outputPos = offset
        val planeBuffer = buffer.duplicate()

        for (row in 0 until height) {
            val length = if (pixelStride == 1 && outputStride == 1) {
                width
            } else {
                (width - 1) * pixelStride + 1
            }

            if (length > rowData.size) {
                return
            }

            planeBuffer.get(rowData, 0, length)
            for (col in 0 until width) {
                out[outputPos] = rowData[col * pixelStride]
                outputPos += outputStride
            }

            if (row < height - 1) {
                planeBuffer.position(planeBuffer.position() + rowStride - length)
            }
        }
    }
}
