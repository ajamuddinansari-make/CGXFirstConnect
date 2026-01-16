// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider

// @main
// class AppDelegate: UIResponder, UIApplicationDelegate {
//   var window: UIWindow?

//   var reactNativeDelegate: ReactNativeDelegate?
//   var reactNativeFactory: RCTReactNativeFactory?

//   func application(
//     _ application: UIApplication,
//     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//   ) -> Bool {
//     let delegate = ReactNativeDelegate()
//     let factory = RCTReactNativeFactory(delegate: delegate)
//     delegate.dependencyProvider = RCTAppDependencyProvider()

//     reactNativeDelegate = delegate
//     reactNativeFactory = factory

//     window = UIWindow(frame: UIScreen.main.bounds)

//     factory.startReactNative(
//       withModuleName: "CGXFirstConnect",
//       in: window,
//       launchOptions: launchOptions
//     )

//     return true
//   }
// }

// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
//   override func sourceURL(for bridge: RCTBridge) -> URL? {
//     self.bundleURL()
//   }

//   override func bundleURL() -> URL? {
// #if DEBUG
//     RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
// #else
//     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//   }
// }











import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {

        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory

        window = UIWindow(frame: UIScreen.main.bounds)

        // Start React Native normally
        factory.startReactNative(
            withModuleName: "CGXFirstConnect",
            in: window,
            launchOptions: launchOptions
        )

        // 🔐 Apply screenshot protection AFTER RN loads
        DispatchQueue.main.async {
            self.protectFromScreenshots()
        }

        return true
    }

    // MARK: - Screenshot Protection
    private func protectFromScreenshots() {
        guard let window = window else { return }

        // Prevent duplicate secure layers
        if window.viewWithTag(9999) != nil { return }

        let secureField = UITextField(frame: window.bounds)
        secureField.tag = 9999
        secureField.isSecureTextEntry = true
        secureField.isUserInteractionEnabled = false
        secureField.backgroundColor = .clear

        window.addSubview(secureField)
        secureField.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            secureField.leadingAnchor.constraint(equalTo: window.leadingAnchor),
            secureField.trailingAnchor.constraint(equalTo: window.trailingAnchor),
            secureField.topAnchor.constraint(equalTo: window.topAnchor),
            secureField.bottomAnchor.constraint(equalTo: window.bottomAnchor)
        ])

        // ⭐ Key line that actually blocks screenshots
        window.layer.superlayer?.addSublayer(secureField.layer)
    }
}

// MARK: - React Native Delegate
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

    override func sourceURL(for bridge: RCTBridge) -> URL? {
        bundleURL()
    }

    override func bundleURL() -> URL? {
#if DEBUG
        return RCTBundleURLProvider.sharedSettings()
            .jsBundleURL(forBundleRoot: "index")
#else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
    }
}
