//**Configuracion Global*/
const CAPABILITIES = {
  platformName: "Android",
  "appium:udid": "ffbc3fc2", // ID del dispositivo
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true,
  "appium:newCommandTimeout": 300,
};

// Selectores de la app
const SELECTORS = {
  tiktokIcon: [
    '-android uiautomator:new UiSelector().description("TikTok")',
    '-android uiautomator:new UiSelector().text("TikTok")',
  ],
  splashScreen: "id:com.zhiliaoapp.musically:id/jnh",
  searchButton1: [
    "id:com.zhiliaoapp.musically:id/gky",
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/gll").instance(1)',
  ],
  searchInput: "id:com.zhiliaoapp.musically:id/eu9",
  searchButton2: [
    "id:com.zhiliaoapp.musically:id/sjd",
    "id:com.zhiliaoapp.musically:id/skb",
  ],
  usersButton: ["accessibility id:Usuarios"],
  firstUser: [
    'android=new UiSelector().className("android.widget.Button").instance(0)',
    '-android uiautomator:new UiSelector().resourceId("com.zhiliaoapp.musically:id/o6n").instance(0)',
  ],
  firstVideo: [
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/cover").instance(1)',
  ],
  likeButton: ["id:com.zhiliaoapp.musically:id/dt3"],
  addVideo: ["id:com.zhiliaoapp.musically:id/f31"],
};

export { CAPABILITIES, SELECTORS };
