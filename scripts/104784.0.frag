/*
 * Original shader from: https://www.shadertoy.com/view/DsK3Wz
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define rotation(angle) mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

float PI = 3.14159256;
float TAU = 2.0*3.14159256;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float circleSDF(vec2 coords, float rad, vec2 offset){
  return (length(coords-offset) - rad);
}

float circleSDF2(vec2 coords, float rad, vec2 offset){
  return abs(length(coords-offset) - rad)-.199080979001;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
   vec2 uv = ( fragCoord - .5* iResolution.xy ) /iResolution.y;
   
  // Translate, rotate, translate back
  uv += vec2(-0.4,0.0) ; 
  uv *= rotation(PI/2.*pow((1.42-pow(length(uv),.5)),15.));
  uv += vec2(0.4,0.0);
  
  // Translate, rotate, translate back
  uv += vec2(0.4,0.0);
  uv *= rotation(PI/2.*pow((1.42-pow(length(uv),.5)),15.)); 
  uv += vec2(-0.4,0.0);
  
  // Determine which vortex the point is closer to
  float d = pow(min(distance(uv, vec2(-0.4, 0.)),distance(uv,vec2(0.4, 0.))),1.5); 

  // Motion and repetition
  float modVal = .1;
  uv += vec2(-iTime*modVal, 1.);
  uv = mod(uv,modVal);
   
  vec3 col = vec3(0.);
   
  float dd = map(d, 0., 1.25, .015, 0.);  
  
  // Draw the circles
  float cSDF = circleSDF(uv, .035-pow(dd,1.20), vec2(modVal/2.0,modVal/2.0));
  col += 3.5*d*smoothstep(.006,-.006,cSDF);  
   
  float cSDF2 = circleSDF2(uv, .06-pow(dd,1.20), vec2(modVal/2.0,modVal/2.0));
  col += 3.5*d*smoothstep(.006,-.006,cSDF2); 
  
  fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}