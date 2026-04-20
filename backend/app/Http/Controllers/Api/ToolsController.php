<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ToolsController extends Controller
{
    public function compressImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240', // Base max 10MB
            'quality' => 'integer|min:1|max:100'
        ]);

        $file = $request->file('image');
        $quality = (int) $request->input('quality', 60);

        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getPathname());
            
            // Encode the image maintaining the original format or converting if requested
            $format = $request->input('format', 'original');
            $rotation = (int) $request->input('rotate', 0);
            $mime = $file->getMimeType();

            if ($rotation !== 0) {
                // In Intervention Image 3, rotate takes angle. 
                // Positive angle typically rotates counter-clockwise or clockwise depending on driver, let's use it directly.
                // Assuming negative or positive works.
                $image->rotate($rotation);
            }

            if ($format === 'jpeg' || $format === 'jpg' || ($format === 'original' && $mime === 'image/jpeg')) {
                $encoded = $image->toJpeg($quality);
                $ext = 'jpg';
            } elseif ($format === 'png' || ($format === 'original' && $mime === 'image/png')) {
                $encoded = $image->toPng(); // Png quality handling varries in v3, but we just call it
                $ext = 'png';
            } elseif ($format === 'webp' || ($format === 'original' && $mime === 'image/webp')) {
                $encoded = $image->toWebp($quality);
                $ext = 'webp';
            } elseif ($format === 'gif' || ($format === 'original' && $mime === 'image/gif')) {
                $encoded = $image->toGif();
                $ext = 'gif';
            } else {
                $encoded = $image->toJpeg($quality);
                $ext = 'jpg';
            }

            $outFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME) . '_converted.' . $ext;

            return response($encoded->toString())
                ->header('Content-Type', $encoded->mediaType())
                ->header('Content-Disposition', 'attachment; filename="' . $outFilename . '"');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to compress image: ' . $e->getMessage()], 500);
        }
    }

    public function mergePdf(Request $request)
    {
        $request->validate([
            'files' => 'required|array|min:2',
            'files.*' => 'required|mimes:pdf|max:20480' // max 20MB per file
        ]);

        $files = $request->file('files');

        try {
            $merger = new \iio\libmergepdf\Merger();
            foreach ($files as $file) {
                $merger->addFile($file->getPathname());
            }

            $mergedPdf = $merger->merge();

            return response($mergedPdf)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="merged.pdf"');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to merge PDFs: ' . $e->getMessage()], 500);
        }
    }
}
