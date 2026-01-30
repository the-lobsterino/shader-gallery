#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM 100.
#define THCKN .001
#define PI  3.1415926
#define PI2 6.2831853

            
void main() {
	
    vec2 lM = vec2(max(resolution.x, resolution.y), min(resolution.x, resolution.y));
    vec2 pos = (gl_FragCoord.xy -.5 * lM) / lM.x;
	float pix = fwidth(pos.x);
	float an = PI2/NUM;
        for (float i = 0.; i < NUM; i++)  {  
  	    float dn = i * an;
            float timed = time * .8 + dn;
		float wave = .39 - 0.01;
            vec2 circPos = vec2(
                sin(timed) * wave*(i/100.),
                cos(timed) * wave*(i/50.)
            );
            vec4 mate = vec4(sin(dn+time),sin(-dn)*cos(-dn),dn,1.);
            float dist = abs(distance((pos), circPos) - .1 + THCKN);
            if(dist < THCKN) {
                gl_FragColor = mix(vec4(0.,2.,0.,1.), mate, 1.-abs(dist));
                return;
            }
        }
    gl_FragColor = vec4(0.,0.,0.,1.);
}