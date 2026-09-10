function convertOklabToRgbMatrix(L: number, a: number, b: number, alpha = 1): string {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLinear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const gamma = (val: number) => {
    const abs = Math.abs(val);
    const sign = val < 0 ? -1 : 1;
    const transformed = abs <= 0.0031308 ? 12.92 * abs : 1.055 * Math.pow(abs, 1 / 2.4) - 0.055;
    return sign * transformed;
  };

  const r = Math.max(0, Math.min(255, Math.round(gamma(rLinear) * 255)));
  const g = Math.max(0, Math.min(255, Math.round(gamma(gLinear) * 255)));
  const bl = Math.max(0, Math.min(255, Math.round(gamma(bLinear) * 255)));

  return alpha < 1 ? `rgba(${r}, ${g}, ${bl}, ${alpha})` : `rgb(${r}, ${g}, ${bl})`;
}

function convertOklchToRgb(l: number, c: number, hDeg: number, alpha = 1): string {
  const hRad = isNaN(hDeg) ? 0 : (hDeg * Math.PI) / 180;
  const L = l;
  const a = isNaN(c) ? 0 : c * Math.cos(hRad);
  const b = isNaN(c) ? 0 : c * Math.sin(hRad);
  return convertOklabToRgbMatrix(L, a, b, alpha);
}

export function replaceOklch(input: string): string {
  if (!input) return input;
  return input.replace(
    /oklch\(\s*([-\d.%]+)[\s,]+([-\d.%]+)[\s,]+([-\d.deg%]+)(?:[\s,/]+([-\d.%]+))?\s*\)/gi,
    (_match, lStr, cStr, hStr, aStr) => {
      try {
        const l = lStr && lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr || '0');
        const c = cStr && cStr.endsWith('%') ? parseFloat(cStr) / 100 : parseFloat(cStr || '0');
        let h = parseFloat(hStr || '0');
        if (hStr && hStr.endsWith('turn')) {
          h = parseFloat(hStr) * 360;
        } else if (hStr && hStr.endsWith('rad')) {
          h = parseFloat(hStr) * (180 / Math.PI);
        }
        let alpha = 1;
        if (aStr) {
          alpha = aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
        }
        if (isNaN(l) || isNaN(c) || isNaN(h) || isNaN(alpha)) {
          return 'rgb(120, 120, 120)';
        }
        return convertOklchToRgb(l, c, h, alpha);
      } catch {
        return 'rgb(120, 120, 120)';
      }
    }
  );
}

export function replaceOklab(input: string): string {
  if (!input) return input;
  return input.replace(
    /oklab\(\s*([-\d.%]+)[\s,]+([-\d.%]+)[\s,]+([-\d.%]+)(?:[\s,/]+([-\d.%]+))?\s*\)/gi,
    (_match, lStr, aStr, bStr, alphaStr) => {
      try {
        const l = lStr && lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr || '0');
        const a = aStr && aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr || '0');
        const b = bStr && bStr.endsWith('%') ? parseFloat(bStr) / 100 : parseFloat(bStr || '0');
        let alpha = 1;
        if (alphaStr) {
          alpha = alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr);
        }
        if (isNaN(l) || isNaN(a) || isNaN(b) || isNaN(alpha)) {
          return 'rgb(120, 120, 120)';
        }
        return convertOklabToRgbMatrix(l, a, b, alpha);
      } catch {
        return 'rgb(120, 120, 120)';
      }
    }
  );
}

export function sanitizeCssForHtml2Canvas(cssText: string): string {
  if (!cssText) return cssText;
  let result = cssText;

  if (result.includes('oklch') || result.includes('OKLCH')) {
    result = replaceOklch(result);
  }
  if (result.includes('oklab') || result.includes('OKLAB')) {
    result = replaceOklab(result);
  }

  // Fallback regex replacements for any remaining modern color formats
  result = result.replace(/oklch\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgb(100, 116, 139)');
  result = result.replace(/oklab\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgb(100, 116, 139)');
  result = result.replace(/color-mix\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgba(100, 116, 139, 0.15)');
  result = result.replace(/light-dark\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgb(30, 41, 59)');
  result = result.replace(/lch\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgb(120, 120, 120)');
  result = result.replace(/lab\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi, 'rgb(120, 120, 120)');

  return result;
}

export function sanitizeClonedDocument(clonedDoc: Document) {
  const clonedPoster = clonedDoc.getElementById('print-poster');
  if (clonedPoster) {
    clonedPoster.style.borderRadius = '0px';
    clonedPoster.style.border = 'none';
    clonedPoster.style.boxShadow = 'none';
    clonedPoster.style.contentVisibility = 'visible';
  }

  // 1. Sanitize <style> elements
  try {
    clonedDoc.querySelectorAll('style').forEach((styleEl) => {
      if (styleEl.textContent && (
        styleEl.textContent.includes('oklch') ||
        styleEl.textContent.includes('oklab') ||
        styleEl.textContent.includes('color-mix') ||
        styleEl.textContent.includes('light-dark') ||
        styleEl.textContent.includes('lch') ||
        styleEl.textContent.includes('lab')
      )) {
        styleEl.textContent = sanitizeCssForHtml2Canvas(styleEl.textContent);
      }
    });
  } catch (err) {
    console.warn('Failed to sanitize <style> elements in clone:', err);
  }

  // 2. Sanitize styleSheets
  try {
    const styleSheets = Array.from(clonedDoc.styleSheets);
    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule instanceof CSSStyleRule) {
              for (let propIdx = 0; propIdx < rule.style.length; propIdx++) {
                const propName = rule.style[propIdx];
                const propVal = rule.style.getPropertyValue(propName);
                if (
                  propVal && (
                    propVal.includes('oklch') ||
                    propVal.includes('oklab') ||
                    propVal.includes('color-mix') ||
                    propVal.includes('light-dark') ||
                    propVal.includes('lch') ||
                    propVal.includes('lab')
                  )
                ) {
                  rule.style.setProperty(propName, sanitizeCssForHtml2Canvas(propVal));
                }
              }
            }
          }
        }
      } catch {
        // Cross-origin stylesheet rules access might be restricted; ignore safely
      }
    }
  } catch (err) {
    console.warn('Global stylesheets parsing exception bypass:', err);
  }

  // 3. Sanitize inline styles
  try {
    clonedDoc.querySelectorAll('[style]').forEach((el) => {
      const styleAttr = el.getAttribute('style');
      if (
        styleAttr && (
          styleAttr.includes('oklch') ||
          styleAttr.includes('oklab') ||
          styleAttr.includes('color-mix') ||
          styleAttr.includes('light-dark') ||
          styleAttr.includes('lch') ||
          styleAttr.includes('lab')
        )
      ) {
        el.setAttribute('style', sanitizeCssForHtml2Canvas(styleAttr));
      }
    });
  } catch (err) {
    console.warn('Failed to sanitize inline style attributes in clone:', err);
  }
}
