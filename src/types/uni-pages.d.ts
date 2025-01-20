/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/home/home" |
       "/pages/about/about" |
       "/pages/accountsettlement/accountsettlement" |
       "/pages/accountupload/accountupload" |
       "/pages/addcount/addcount" |
       "/pages/articles/accounts_articles" |
       "/pages/articles/articles" |
       "/pages/deal/deal" |
       "/pages/deal/user_service_deal" |
       "/pages/income/income" |
       "/pages/login/login" |
       "/pages/login/register" |
       "/pages/profile/profile" |
       "/pages/settlement/settlement" |
       "/pages/settlements/settlements" |
       "/pages/task/task" |
       "/pages/unpublishtasks/unpublishtasks" |
       "/pages/upload/upload";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
