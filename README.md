# lufke_app
Aplicación móvil para lufke

## Como instalar

### Para testear aplicación

Descargar drivers de celular

Instalar los plugin ejecutando los comandos:
```
cordova plugin add cordova-plugin-whitelist
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-statusbar
cordova plugin add org.apache.cordova.dialogs
```

Si al instalar el paquete "cordova plugin add https://github.com/phonegap-build/PushPlugin.git" aparece el error
	Error: EXDEV, cross-device link not permitted 
	
	Editar el siguiente archivo:
```
	C:\Users\<nombre de usuario>\AppData\Roaming\npm\node_modules\cordova\node_modules\cordova-lib\src\plugman\util\plugins.js
```


		linea 53
```
			- shell.mv(path.join(tmp_dir, '*'), plugin_dir);
			+ shell.cp('-R', path.join(tmp_dir, '*'), plugin_dir);
```

	Fuente: [https://github.com/apache/cordova-lib/commit/66007122d1d8096aae2142f24f83c6ded20e6d8d](https://github.com/apache/cordova-lib/commit/66007122d1d8096aae2142f24f83c6ded20e6d8d)

Agregar al Android Manifest del proyecto:
```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />		
```
	Fuente: [http://forum.ionicframework.com/t/ionic-run-android-works-but-apk-does-not-access-internet/3867/21](http://forum.ionicframework.com/t/ionic-run-android-works-but-apk-does-not-access-internet/3867/21)
	
Ejecutar ionic con: ionic run --device

Para ejecutar ionic y pueda ser visto desde otros computadores ejecutar el comando: ionic serve --all
	Fuente [http://blog.ionic.io/handling-cors-issues-in-ionic/](http://blog.ionic.io/handling-cors-issues-in-ionic/)
