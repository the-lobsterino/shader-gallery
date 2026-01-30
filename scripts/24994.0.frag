#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159
#define ZOOM 0.4
#define ITERATIONS 100
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
 
        float xC = (gl_FragCoord.x-(resolution.x/2.0))/(resolution.x*ZOOM*(resolution.y/resolution.x));
        float yC = (gl_FragCoord.y-(resolution.y/2.0))/(resolution.y*ZOOM);
        float xS = 0.0;
        float yS = 0.0;
        for(int i = 0; i < ITERATIONS; i++) {
                if(xS*xS+yS*yS>4.0) {
        		gl_FragColor = vec4(sin(float(i)/10.0), sin((float(i)-8.0*PI)/10.0), sin((float(i)-4.0*PI)/10.0), 0);
                        return;
                }
                float xTmp=xS*xS-yS*yS;
                float yTmp=2.0*xS*yS;
                xTmp+=xC;
                yTmp+=yC;
                xS=xTmp;
                yS=yTmp;
               
        }
        gl_FragColor = vec4(0, 0, 0, 0);
 
}