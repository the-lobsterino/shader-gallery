#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform sampler2D texture;

          

          void main(void) {
		vec2 vUv = gl_FragCoord.xy / resolution;
            vec2 ratio = vec2(
                min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
                min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
              );

            vec2 uv = vec2(
                vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
              );
            gl_FragColor = texture2D(texture, uv);
}