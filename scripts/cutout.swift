// Usage: swift cutout.swift in.jpg out.png
// Removes the background with Vision's subject-lifting mask (macOS 14+).
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
let input = CIImage(contentsOf: URL(fileURLWithPath: args[1]))!
let handler = VNImageRequestHandler(ciImage: input)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subject found") }
let buffer = try result.generateMaskedImage(
    ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let ctx = CIContext()
let out = CIImage(cvPixelBuffer: buffer)
try ctx.writePNGRepresentation(
    of: out, to: URL(fileURLWithPath: args[2]), format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok")
