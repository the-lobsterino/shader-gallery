#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  
  vec3 sky_color = vec3(0.97, 0.69, 0.36);
  vec3 ground_color = vec3(0.31, 0.25, 0.22);
  vec3 sun_color = vec3(1.0, 0.91, 0.51);
  
  // Calculate the sun position based on time
  float sun_pos = mix(-0.2, 0.8, u_time / 20.0);
  
  // Calculate the sky and ground colors based on sun position
  vec3 color = mix(
    mix(sky_color, sun_color, pow(1.0 - st.y, 2.0)), 
    ground_color, 
    pow(st.y, 2.0)
  );
  
  // Calculate the sun
  vec2 sun_pos_xy = vec2(sun_pos, pow(sun_pos, 2.0) * 0.6 + 0.4);
  float sun_size = mix(0.15, 0.25, pow(1.0 - st.y, 2.0));
  float sun_dist = length(st - sun_pos_xy);
  float sun_alpha = 1.0 - smoothstep(sun_size, sun_size + 0.005, sun_dist);
  color = mix(color, sun_color, sun_alpha);
  
  gl_FragColor = vec4(color, 1.0);
}






