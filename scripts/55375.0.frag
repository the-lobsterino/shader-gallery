precision mediump float;

varying vec2 ndcPos;  // normaliced device coordinates in range [-1.0, 1.0]
uniform float u_time;
uniform vec2  u_resolution;

const float PI = 3.141592653;

float sector(vec2 c, vec2 p, float r, float sa, float alpha){
    float bl = 0.1;
    float l  = abs(distance(p, c ));
    float t  = smoothstep(r-bl, r + bl, l); 
    vec2  uv = p - c;
    float a = atan(uv.y, uv.x);
    if (a < 0.0) a += 2.0*PI;
    t  = a >= sa         ? t : 1.0;
    t  = a <= sa + alpha ? t : 1.0;
    return t;
}

void main()
{
   vec4 white = vec4(1.0,1.0,1.0,1.0);
   vec4 black = vec4(0.0,0.0,0.0,1.0);
  
   vec2 p  = (gl_FragCoord.xy * 2.0 - u_resolution)/min(u_resolution.x,u_resolution.y);
  
   float t = sector(vec2(0.0), p, 0.5, 0.0, mod(u_time, 2.0*PI));
  
   gl_FragColor = mix(white,black,t);
}