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









//
//  AppDelegate.swift
//  CGXFirstConnect
//




// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider
// import Firebase


// @main
// class AppDelegate: UIResponder, UIApplicationDelegate {

//     var window: UIWindow?
//     var reactNativeDelegate: ReactNativeDelegate?
//     var reactNativeFactory: RCTReactNativeFactory?

//     func application(
//         _ application: UIApplication,
//         didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//     ) -> Bool {

//       FirebaseApp.configure()
       
//         let delegate = ReactNativeDelegate()
//         let factory = RCTReactNativeFactory(delegate: delegate)
//         delegate.dependencyProvider = RCTAppDependencyProvider()

//         reactNativeDelegate = delegate
//         reactNativeFactory = factory

//         window = UIWindow(frame: UIScreen.main.bounds)

      
//         factory.startReactNative(
//             withModuleName: "CGXFirstConnect",
//             in: window,
//             launchOptions: launchOptions
//         )

//         DispatchQueue.main.async {
//             self.enableSecureWindow()
//         }

//         return true
//     }

    
//     private func enableSecureWindow() {
//         guard let window = window else { return }

        
//         if window.viewWithTag(9999) != nil { return }

    
//         let secureField = UITextField(frame: window.bounds)
//         secureField.tag = 9999
//         secureField.isSecureTextEntry = true    
//         secureField.isUserInteractionEnabled = false
//         secureField.backgroundColor = .clear

//         window.addSubview(secureField)
//         secureField.translatesAutoresizingMaskIntoConstraints = false

//         NSLayoutConstraint.activate([
//             secureField.leadingAnchor.constraint(equalTo: window.leadingAnchor),
//             secureField.trailingAnchor.constraint(equalTo: window.trailingAnchor),
//             secureField.topAnchor.constraint(equalTo: window.topAnchor),
//             secureField.bottomAnchor.constraint(equalTo: window.bottomAnchor)
//         ])
//     }
// }


// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

//     override func sourceURL(for bridge: RCTBridge) -> URL? {
//         bundleURL()
//     }

//     override func bundleURL() -> URL? {
// #if DEBUG
//         return RCTBundleURLProvider.sharedSettings()
//             .jsBundleURL(forBundleRoot: "index")
// #else
//         return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//     }
// }













// import UIKit
// import React
// import React_RCTAppDelegate
// import ReactAppDependencyProvider
// import Firebase
// import UserNotifications

// @main
// class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

//     var window: UIWindow?
//     var reactNativeDelegate: ReactNativeDelegate?
//     var reactNativeFactory: RCTReactNativeFactory?

//     func application(
//         _ application: UIApplication,
//         didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//     ) -> Bool {

//         FirebaseApp.configure()
        
//         // Setup notifications
//         UNUserNotificationCenter.current().delegate = self
        
//         // Register for remote notifications
//         application.registerForRemoteNotifications()
        
//         let delegate = ReactNativeDelegate()
//         let factory = RCTReactNativeFactory(delegate: delegate)
//         delegate.dependencyProvider = RCTAppDependencyProvider()

//         reactNativeDelegate = delegate
//         reactNativeFactory = factory

//         window = UIWindow(frame: UIScreen.main.bounds)

//         factory.startReactNative(
//             withModuleName: "CGXFirstConnect",
//             in: window,
//             launchOptions: launchOptions
//         )

//         DispatchQueue.main.async {
//             self.enableSecureWindow()
//         }

//         return true
//     }
    
//     // MARK: - Push Notifications Registration
    
//     func application(
//         _ application: UIApplication,
//         didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
//     ) {
//         // Pass device token to React Native
//         // For Firebase
//         Messaging.messaging().apnsToken = deviceToken
        
//         // For React Native (if using libraries like @react-native-firebase/messaging)
//         NotificationCenter.default.post(
//             name: Notification.Name("RCTRemoteNotificationRegistered"),
//             object: nil,
//             userInfo: ["deviceToken": deviceToken]
//         )
//     }
    
//     func application(
//         _ application: UIApplication,
//         didFailToRegisterForRemoteNotificationsWithError error: Error
//     ) {
//         print("Failed to register for remote notifications: \(error.localizedDescription)")
        
//         NotificationCenter.default.post(
//             name: Notification.Name("RCTRemoteNotificationRegistrationFailed"),
//             object: nil,
//             userInfo: ["error": error]
//         )
//     }
    
//     // MARK: - Handling Notifications
    
//     func application(
//         _ application: UIApplication,
//         didReceiveRemoteNotification userInfo: [AnyHashable: Any],
//         fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
//     ) {
//         // Forward to React Native
//         NotificationCenter.default.post(
//             name: Notification.Name("RCTRemoteNotificationReceived"),
//             object: nil,
//             userInfo: userInfo
//         )
        
//         completionHandler(.newData)
//     }
    
//     // MARK: - UNUserNotificationCenterDelegate
    
//     // Handle foreground notifications
//     func userNotificationCenter(
//         _ center: UNUserNotificationCenter,
//         willPresent notification: UNNotification,
//         withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
//     ) {
//         // Show notification even when app is in foreground
//         if #available(iOS 14.0, *) {
//             completionHandler([.banner, .sound, .badge, .list])
//         } else {
//             completionHandler([.alert, .sound, .badge])
//         }
//     }
    
//     // Handle notification response (when user taps notification)
//     func userNotificationCenter(
//         _ center: UNUserNotificationCenter,
//         didReceive response: UNNotificationResponse,
//         withCompletionHandler completionHandler: @escaping () -> Void
//     ) {
//         let userInfo = response.notification.request.content.userInfo
        
//         NotificationCenter.default.post(
//             name: Notification.Name("RCTRemoteNotificationReceived"),
//             object: nil,
//             userInfo: userInfo
//         )
        
//         completionHandler()
//     }

//     private func enableSecureWindow() {
//         guard let window = window else { return }
        
//         if window.viewWithTag(9999) != nil { return }
    
//         let secureField = UITextField(frame: window.bounds)
//         secureField.tag = 9999
//         secureField.isSecureTextEntry = true    
//         secureField.isUserInteractionEnabled = false
//         secureField.backgroundColor = .clear

//         window.addSubview(secureField)
//         secureField.translatesAutoresizingMaskIntoConstraints = false

//         NSLayoutConstraint.activate([
//             secureField.leadingAnchor.constraint(equalTo: window.leadingAnchor),
//             secureField.trailingAnchor.constraint(equalTo: window.trailingAnchor),
//             secureField.topAnchor.constraint(equalTo: window.topAnchor),
//             secureField.bottomAnchor.constraint(equalTo: window.bottomAnchor)
//         ])
//     }
// }

// class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

//     override func sourceURL(for bridge: RCTBridge) -> URL? {
//         bundleURL()
//     }

//     override func bundleURL() -> URL? {
// #if DEBUG
//         return RCTBundleURLProvider.sharedSettings()
//             .jsBundleURL(forBundleRoot: "index")
// #else
//         return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
// #endif
//     }
// }

















import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {

        // Configure Firebase
        FirebaseApp.configure()

        // Setup notification center
        let center = UNUserNotificationCenter.current()
        center.delegate = self

        // Request notification permission
        center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            } else {
                print("Notification permission denied: \(String(describing: error))")
            }
        }

        // React Native initialization
        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory

        window = UIWindow(frame: UIScreen.main.bounds)

        factory.startReactNative(
            withModuleName: "CGXFirstConnect",
            in: window,
            launchOptions: launchOptions
        )

        // Enable secure overlay
        DispatchQueue.main.async {
            self.enableSecureWindow()
        }

        return true
    }

    // MARK: - APNs Token Registration

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        // Pass APNs token to Firebase
        Messaging.messaging().apnsToken = deviceToken
        print("APNs device token registered with Firebase")
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        print("Failed to register for remote notifications: \(error.localizedDescription)")
    }

    // MARK: - Background Notification Handling

    func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable : Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        completionHandler(.newData)
    }

    // MARK: - Foreground Notification Handling (Avoid Duplicate)

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Do NOT show system notification in foreground
        // We'll show it in JS via Notifee to prevent duplicates
        completionHandler([])
    }

    // MARK: - Notification Tap Handling

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        print("Notification tapped:", userInfo)
        completionHandler()
    }

    // MARK: - Secure Screen Overlay

    private func enableSecureWindow() {
        guard let window = window else { return }

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