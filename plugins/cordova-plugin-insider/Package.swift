// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "cordova-plugin-insider",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "cordova-plugin-insider", targets: ["cordova-plugin-insider"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master"),
        .package(url: "https://github.com/useinsider/Insider-iOS-SDK.git", exact: "2.5.1")
    ],
    targets: [
        .target(
            name: "cordova-plugin-insider",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "InsiderMobile", package: "Insider-iOS-SDK"),
                .product(name: "InsiderGeofence", package: "Insider-iOS-SDK")
            ],
            path: "src/ios",
            resources: [],
            publicHeadersPath: ".",
            linkerSettings: [
                .linkedLibrary("sqlite3"),
                .linkedLibrary("icucore")
            ]
        )
    ]
)
