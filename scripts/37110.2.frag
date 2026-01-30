#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
		vec3 hsv2rgb(vec3 c);
		int xor(int a, int b);
		vec3 hsv2rgb(vec3 c)
		{
			vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
			vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
			return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
		}
		ivec4 imod4_2(ivec4 x){
		    return x - (2*(x/2));}		
		ivec4 parselowbits(int x){
		    ivec4 n = ivec4(x);
		    ivec4 d = ivec4(8,4,2,1);
		    ivec4 r = n/d;
		    ivec4 a = imod4_2(r);
		    return a;}
		ivec4 parsehighbits(int x){
		    ivec4 n = ivec4(x);
		    ivec4 d = ivec4(8*16,4*16,2*16,1*16);
		    ivec4 r = n/d;
		    ivec4 a = imod4_2(r);
		    return a;}
		int xor(int a, int b){
		    ivec4 d = ivec4(8,4,2,1);
		    ivec4 d1 = ivec4(8,4,2,1)*16;
		    ivec4 lb1 = parselowbits(a);
		    ivec4 hb1 = parsehighbits(a);
		    ivec4 lb2 = parselowbits(b);
		    ivec4 hb2 = parsehighbits(b);
		    int v = 0;
		    if (lb1.x != lb2.x){v += d.x;}
		    if (lb1.y != lb2.y){v += d.y;}
		    if (lb1.z != lb2.z){v += d.z;}
		    if (lb1.w != lb2.w){v += d.w;}	
		    if (hb1.x != hb2.x){v += d1.x;}
		    if (hb1.y != hb2.y){v += d1.y;}
		    if (hb1.z != hb2.z){v += d1.z;}
		    if (hb1.w != hb2.w){v += d1.w;}			 
		    return v;}
		void main(){
			float PI = 3.1415926535897932384626433832795;
			float x = gl_FragCoord.x;
			float y = gl_FragCoord.y;
			float ratio = 64.0;
			float dist = mod((ratio * 256.0 / distance((resolution / 2.0), gl_FragCoord.xy )) , 256.0);
			float angle = 0.5 * 256.0 * (atan(y - resolution.y/ 2.0, x - resolution.x / 2.0)/PI);
			float shiftX = (256.0 * 1.0 * time);
			float shiftY = (256.0* 0.25 * time);
			float col = float(xor(int(mod((dist + shiftX)  , 256.0)),int(mod((angle + shiftY ) , 256.0) )));
			gl_FragColor = vec4(0.0,0.0,col/256.0, 1.0);
            } 			