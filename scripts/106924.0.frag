#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define M_PI 3.1415926535897932384626433832795
 float random(vec2 co){
    
        float a = 12.9898;
        float b = 78.233;
        float c = 43758.5453;
        float dt= dot(co.xy ,vec2(a,b));
        float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	 vec4 outColor = vec4(0.0, 0.0,0.0,1.0);
        float time = time * 0.1;
        vec2 uvNorm = gl_FragCoord.xy / resolution.xy;
        vec2 uv = (uvNorm - 0.5) * vec2(resolution.x / resolution.y, 1.0);
        uv *= 0.25; // scale 
    
        //for(float i=0.0; i<600.0 ;i++){
        for(float i=0.0; i<30.0 ;i++){  
    
            float f1 = mod(sin(time) * i * 0.101213, 0.28);
            float fft = time*0.001;
            float r = (fft/10.0);
            float a = random(vec2(i,i))*(M_PI*2.);
    
            vec2 center = vec2(cos(a), sin(a)) * r/1.2;
            float dist = length(uv - center);
            float birghtness = 1./pow(0.01 + dist*250., 2.);
    
            vec3 color = vec3(fft-0.1, 1.0, fft-0.2);
            vec3 col = color* birghtness/2.0 * fft * 2.;
            col += color * birghtness * fft * 1.5;
            outColor.rgb += col;
         }
    
       gl_FragColor = outColor;

}