#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const vec3 SKY = vec3( 0.1, 0.2, 0.4 );


float hash(vec2 p) {
 return fract(sin(dot(p*0.05, vec2(14.52, 76.38)))*43256.2895);   
}

float noise(vec2 pos) {
  vec2 a = vec2(1.0, 0.0);
  vec2 p = floor(pos);
  vec2 f = fract(pos);
  f = f*f*f*(3.0-2.0*f);
    float h = mix(mix(hash(p+a.yy), hash(p+a.xy), f.x), 
                  mix(hash(p+a.yx), hash(p+a.xx), f.x), f.y);
    return h;
}
   

float snoise(vec2 p) {
   float h = 0.0;
    float a = 0.5;
    for (float i=0.0;i<6.0;i++) {
        h+=noise(p)*a;
        p*=1.9;
        a*=0.4;
    } 
    return h;
}

float snoiser(vec2 p) {
   float h = 0.0;
    float a = 0.5;
    for (float i=0.0;i<6.0;i++) {
        h+= abs(noise(p)-0.5)*a*2.0;
        p*=2.5;
        a*=0.7;
    } 
    return h;
}

void main( void ) {

    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	float kkk = resolution.y/resolution.x;
    uv.x *= resolution.x /  resolution.y;
    
    vec3 dir = normalize(vec3(uv, 1.0));

    vec3 col = vec3(0.0);

    //stars  
    col = vec3(smoothstep(0.7+0.3*smoothstep(0.0, 0.35, abs((uv.x*0.5-1.0)*kkk+uv.y)), 1.0, hash(gl_FragCoord.xy))*hash(gl_FragCoord.xy*2.0));
    
    
    //sky gradient
    col += SKY*(abs(uv.y-1.2)*0.4);

    //milky way
    //inner glow
    col = mix(vec3(1.0, 1.0, 0.8), col,0.5+0.5*smoothstep(0.0, 0.07, abs((uv.x*0.5-1.0)*kkk+uv.y)*snoise(5.0*(uv*vec2(kkk, 0.0)-vec2(1.0, -uv.y)))));
    
    //outer shape
    col = mix(SKY*1.2, col,0.8+0.2*smoothstep(0.0, 0.15, abs((uv.x*0.5-1.0)*kkk+uv.y)*snoise(4.0*(uv*vec2(kkk, 0.0)-vec2(1.0, -uv.y)))));
	
    //milky way clouds
    col = mix(SKY*(abs(uv.y-1.2)*0.4), col, 0.1+0.5*smoothstep(0.0, 0.1, abs((uv.x*0.5-1.0)*kkk+uv.y)*snoiser(15.0*(uv*vec2(kkk, 0.0)-vec2(1.0, -uv.y)))));
    col = mix(SKY*(abs(uv.y-1.2)*0.4), col, smoothstep(0.0, 0.03, abs((uv.x*0.5-1.0)*kkk+uv.y)*0.02+0.03*snoiser(15.0*(uv*vec2(kkk, 0.0)-vec2(1.0, -uv.y)))));
    //add nearby stars
    col += vec3(smoothstep(0.95, 1.0, hash(gl_FragCoord.xy))*hash(gl_FragCoord.xy*2.0));

    
    gl_FragColor = vec4(col,1.0);
}

