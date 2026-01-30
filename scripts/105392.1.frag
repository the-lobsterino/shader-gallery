precision highp float;

uniform float frequency;
uniform float padding;
uniform float baseAlpha;
uniform float hatchAlpha;

varying vec2 vUV;

float hatchTest(vec2 uv) {

    float V = uv.x + uv.y;

    float dp = length(vec2(V, V));
    float logdp = -log2(dp * 8.0);
    float ilogdp = floor(logdp);
    float stripes = exp2(ilogdp);

    float sawtooth = fract((V + 0.1) * frequency * stripes);
    float triangle = abs(2.0 * sawtooth - 1.0);

    // adjust line width
    float transition = logdp - ilogdp;

    // taper ends
    triangle = abs((1.0 + transition) * triangle - transition);

    return triangle;
}

void main(void) {

    float isHatch = hatchTest(vUV);
    float isPadding = step(padding, min(vUV.x, min(vUV.y, min(1.0 - vUV.x, 1.0 - vUV.y))));

    if (isPadding < 1.0 || isHatch > 0.5) {
        gl_FragColor = vec4(baseAlpha);
    } else {
        gl_FragColor = vec4(hatchAlpha);
    }
	
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}