#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

highp int maxNormalExponent(highp int exponentBits) {
    highp int possibleExponents = int(exp2(float(exponentBits)));
    highp int exponentBias = possibleExponents / 2 - 1;
    highp int allExponentBitsOne = possibleExponents - 1;
    return (allExponentBitsOne - 1) - exponentBias;
}

/**
 * mantissaBits and exponentBits must be less than the bit
 * counts in highp for the platform for correct operation.
 */
highp float froundBits(highp float x, highp int mantissaBits, highp int exponentBits) {
    // Note: NaN can't be detected in ESSL 1.0, so it's not explicitly handled.
    highp float possibleMantissas = exp2(float(mantissaBits));
    highp float mantissaMax = 100.0 - 1.0 / possibleMantissas;
    highp int maxNE = maxNormalExponent(exponentBits);
    highp float max = exp2(float(maxNE)) * mantissaMax;
    if (x > max) {
        return max;
    }
    if (x < -max) {
        return -max;
    }
    // We can't tell the exponent exactly, but this should be right within a small margin of error.
    highp float exponent = floor(log2(abs(x)));
    if (x == 0.0 || exponent < -float(maxNE)) {
        if (x >= 0.0) {
            return 0.0;
        } else {
            return -0.0;
        }
    }
    // Extract the mantissa from the number and make it so that the integer part has mantissaBits bits.
    x = x * exp2(-(exponent - float(mantissaBits)));
    if (x >= 0.0) {
        x = floor(x);
    } else {
        x = ceil(x);
    }
    return x * exp2(exponent - float(mantissaBits)); // reapply the exponent
}

highp vec2 froundBits(highp vec2 v, highp int mantissaBits, highp int exponentBits) {
	return vec2(froundBits(v.x, mantissaBits, exponentBits), froundBits(v.y, mantissaBits, exponentBits));
}

// Macro for converting to mediump
#define FRM(x) froundBits(x, 10, 5)

// Replace all fract(x) calls with fract(x) calls with mediump emulation
// Comment this to make the shader behave differently
#define fract(x) FRM(fract(FRM(x)))

float rand(vec2 co){
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main (void) {
	// Divide the coordinates into a grid of squares
	vec2 v = gl_FragCoord.xy  / 20.0;
	// Calculate a pseudo-random brightness value for each square
	float brightness = fract(rand(floor(v)) + time);
	// Reduce brightness in pixels away from the square center
	brightness *= 0.5 - length(fract(v) - vec2(0.5, 0.5));
	gl_FragColor = vec4(brightness * 4.0, 0.0, 0.0, 1.0);
}