pluginManagement {
  repositories {
    google {
      content {
        includeGroupByRegex("com\\.android.*")
        includeGroupByRegex("com\\.google.*")
        includeGroupByRegex("androidx.*")
      }
    }
    mavenCentral()
    gradlePluginPortal()
  }
}

plugins { id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0" }

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
  repositories {
    google()
    mavenCentral()
  }
}

rootProject.name = "My Application"

include(":app")
include(":capacitor-android")
project(":capacitor-android").projectDir = file("node_modules/@capacitor/android/capacitor")
include(":capacitor-camera")
project(":capacitor-camera").projectDir = file("node_modules/@capacitor/camera/android")
include(":capacitor-network")
project(":capacitor-network").projectDir = file("node_modules/@capacitor/network/android")
include(":capacitor-android-app")
project(":capacitor-android-app").projectDir = file("android/app")
include(":capacitor-cordova-android-plugins")
project(":capacitor-cordova-android-plugins").projectDir = file("android/capacitor-cordova-android-plugins")

