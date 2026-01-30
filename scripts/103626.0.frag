#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Customizable options
uniform bool u_option1;
uniform float u_option2;
uniform vec3 u_option3;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  
  // Background color
  vec3 background = vec3(0.2, 0.2, 0.2);
  
  // Interactive colors
  vec3 color1 = vec3(1.0, 0.0, 0.0); // Red
  vec3 color2 = vec3(0.0, 1.0, 0.0); // Green
  vec3 color3 = vec3(0.0, 0.0, 1.0); // Blue
  
  // Get complex based on options
  vec3 complexColor = mix(color1, color2, u_option2) * u_option3;
  
  // Calculate reactive visuals
  float speed = 1.0; // Speed of animation
  float intensity = 0.5; // Intensity of visuals
  
  float wave1 = sin(st.x * 10.0 + u_time * speed) * intensity;
  float wave2 = sin(st.y * 10.0 + u_time * speed) * intensity;
  
  vec3 finalColor = mix(background, complexColor, wave1 + wave2);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
