#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D uMainSampler;

void main( void ) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
 vec4 color = texture2D(uMainSampler, uv);

 // Convert the color to RGB
 vec3 rgbColor = vec3(color.r, color.g, color.b);

 // Define the target color
 vec3 targetColor = vec3(1.0, 0.0, 0.0); // Red color

 // Define the color to replace
 vec3 replaceColor = vec3(1.0, 0.8745, 0.7255); // #ffdcba color

 // Calculate the distance between the current color and the color to replace
 float diff = distance(rgbColor, replaceColor);

 // Use the smoothstep function to create a step function that outputs 0.0 if the first argument is less than the second argument and 1.0 otherwise
 float step = smoothstep(0.05, 0.0, diff);

 // Use the mix function to interpolate between the current color and the target color
 color.rgb = mix(color.rgb, targetColor, step);

 // Shift the hue over time
 float hue = mod(time * 0.1, 1.0);
 color = vec4(hue, color.g, color.b, color.a);

 gl_FragColor = color;
}