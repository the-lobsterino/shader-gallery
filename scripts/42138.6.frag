//For J from S

#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float CIRCLE = 6.28-0.1;
float m=mouse.x*CIRCLE*.75-time/10.;
vec2 rot= vec2(cos(m),sin(m));
//float growth = ((sin(time/1000.)/sin(time/300.)+1.)/1.);
float pulse =sin(time/300.);
const float points= CIRCLE*10.;
float growth = points/0.25-pow(2.,0.-time/1.);
const float k= 3./2.;
void main( void ) {

        vec2 position =  (gl_FragCoord.xy - resolution.xy/2.)/resolution.x*200.;
        vec4 c = vec4(0);
        float s=-3.;
        for(float r=0.; r<points; r+=0.25){
		if(r<growth){
                float t=time/15.+r*pulse;
                
                vec3 pr = vec3(cos(t*k)*cos(t),cos(t*k)*sin(t),pow(cos(t*2.*k+CIRCLE*0.75),2.)/k)*5.;
                vec3 p3 = vec3((pr.x*rot.x+pr.y*rot.y),(pr.y*rot.x-pr.x*rot.y),(pr.z)+5.-mouse.y*10.);
                float pd =distance(p3,vec3(7.5))/150.;
                vec2 p=vec2(-p3.x/2.+p3.y/2.,-p3.y/2.-p3.x/2.+p3.z/2.)/pd;
                s+=0.06/distance(p,position)-0.0005;
	}

        }
        c = vec4(s+2.9,s+3.0,s+3.0,1.);
        gl_FragColor = c;
}