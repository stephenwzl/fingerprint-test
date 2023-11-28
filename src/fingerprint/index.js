import { ClientJS } from 'clientjs';
import WebGLInfo from './webgl';

const client = new ClientJS();
/**
 * @description
 * 要获取相对唯一并且可以跟踪的 fingerprint, 经过调研大致以下信息可以使用：
 * 1. WAN IP （需要从Server获取）
 * 2. OS：大致分为 iOS/iPadOS 等
 * 3. 时区
 * 4. 语言设置
 * 5. 设备分辨率、DPI
 * 6. Canvas fingerprint
 * 
 * UA 是不能用的，因为三方浏览器或App中不会提供默认的 UA，而是会提供自己的 UA
 */


export function getCanvasFingerPrint() {
  return client.getCustomFingerprint(client.getCanvasPrint());
}

export function getDeviceInfo() {
  const os = getOS();
  const timezone = client.getTimeZone();
  const language = client.getSystemLanguage();
  const screen = client.getScreenPrint();
  const fonts = client.getFonts();
  const hdr = isHDR();
  const hardwareConcurrency = getHardwareConcurrency();
  const colorGamut = getColorGamut();
  const forcedColor = areColorsForced();
  const plugins = client.getPlugins();
  const privateLink = getPrivateClickMeasurement();
  const reductMotion = isMotionReduced();
  return {
    os, timezone, language, languages: navigator.languages, screen, fonts, hardwareConcurrency,
    hdr, colorGamut, forcedColor, plugins, privateLink, reductMotion
  }
}

export function getOS() {
  return window.navigator.platform || '';
}

export function getHardwareConcurrency() {
  // sometimes hardware concurrency is a string
  return parseInt(window.navigator.hardwareConcurrency || undefined);
}

export function isHDR() {
  if (doesMatch('high')) {
    return true
  }
  if (doesMatch('standard')) {
    return false
  }
  return undefined
}

function doesMatch(value) {
  return matchMedia(`(dynamic-range: ${value})`).matches
}

export function getColorGamut() {
  // rec2020 includes p3 and p3 includes srgb
  for (const gamut of ['rec2020', 'p3', 'srgb']) {
    if (matchMedia(`(color-gamut: ${gamut})`).matches) {
      return gamut
    }
  }
  return undefined
}

export function areColorsForced() {
  if (doesMatchColor('active')) {
    return true
  }
  if (doesMatchColor('none')) {
    return false
  }
  return undefined
}

function doesMatchColor(value) {
  return matchMedia(`(forced-colors: ${value})`).matches
}

export default function getPrivateClickMeasurement() {
  const link = document.createElement('a')
  const sourceId = link.attributionSourceId ?? link.attributionsourceid
  return sourceId === undefined ? undefined : String(sourceId)
}

export function isMotionReduced(){
  if (doesMotionMatch('reduce')) {
    return true
  }
  if (doesMotionMatch('no-preference')) {
    return false
  }
  return undefined
}

function doesMotionMatch(value) {
  return matchMedia(`(prefers-reduced-motion: ${value})`).matches
}

export async function getWebGLFingerPrint() {
  const info = await WebGLInfo();
  return client.getCustomFingerprint(JSON.stringify(info));
}