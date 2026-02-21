import UIKit
import React

@objc(ScreenshotDetector)
class ScreenshotDetector: RCTEventEmitter {

  private let overlayTag = 99999

  override init() {
    super.init()

    // Listen for screenshots
    NotificationCenter.default.addObserver(self,
                                           selector: #selector(userDidTakeScreenshot),
                                           name: UIApplication.userDidTakeScreenshotNotification,
                                           object: nil)
  }

  // Enable blank screenshot overlay
  @objc func enableSecure() {
    DispatchQueue.main.async {
      guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) else { return }

      // Remove old overlay if exists
      window.viewWithTag(self.overlayTag)?.removeFromSuperview()

      // Create a secure UITextField overlay
      let secureField = UITextField(frame: window.bounds)
      secureField.isSecureTextEntry = true
      secureField.isUserInteractionEnabled = false
      secureField.backgroundColor = .clear
      secureField.tag = self.overlayTag

      window.addSubview(secureField)
    }
  }

  // Disable overlay
  @objc func disableSecure() {
    DispatchQueue.main.async {
      guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }) else { return }
      window.viewWithTag(self.overlayTag)?.removeFromSuperview()
    }
  }

  @objc func userDidTakeScreenshot() {
    sendEvent(withName: "ScreenshotTaken", body: nil)
  }

  override func supportedEvents() -> [String]! {
    return ["ScreenshotTaken"]
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}