//  Modded by @dennishjorth, added some dynamics.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
#define PI 3.14159265358979323
float atan2(vec2 a) {
    return atan(a.x,a.y);
}
void main( void ) {
    vec2 uvm = ( gl_FragCoord.xy / resolution.xy )-.5;
    vec2 uv = uvm;
	uv.x /= resolution.y/resolution.x;
    vec3 col = vec3(0.);
    float phase = pow(length(uv), 1./16.)*32.*pow(1.+cos(time*0.2), 8.);
    uv *= mat2(cos(phase), sin(phase), sin(phase), -cos(phase));
    float atans = (atan2(vec2(uv.x,-uv.y))+PI)/(PI*2.);
    float a = 1.125-length(uv)/sin(atans*PI);
    /*float b = 5.;
    uv.y-=1./b;
    uv *= b*b;
    a = pow(pow(uv.x,2.)+pow(uv.y,2.)+(b*uv.y),2.)-(pow(b,2.)*(pow(uv.x,2.)+pow(uv.y,2.)));
    col = vec3(a/(b*b));*/
    float b = 1.0/((uvm.x*uvm.x+uvm.y*uvm.y))*0.01+a;

    col = vec3(b*b*abs(sin(time*0.15)+0.1),
	       b*b*abs(cos(time*0.2)+0.1),
	       b*b*abs(cos(time*0.1)+0.1));
    gl_FragColor = vec4(col,1.0);
	gl_FragColor += 0.975 * (texture2D(backbuffer, gl_FragCoord.xy/resolution) - gl_FragColor);
}