#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float yayhash(vec2 p) {
    p = mod(p,3000.);
    int a = int(p.x);
    int b = int(p.y);
    float f = float(b*a+(a*b)+a+b/((int(mod(float(a),4.)))+1));
return tan(sin(f*12345.737294)-cos(f*47.3543))*250.;
}


void main( void ) {

    vec2 c = gl_FragCoord.xy;
    c.y += mod(time*resolution.y/9.,3000.);
    vec2 f = (c/resolution.xx)*384.;
    vec2 n = floor((c/resolution.xx)*48.);
    ivec2 a = ivec2(mod(abs(f),8.));
    int m = a.x;
    int o = a.y;
    int r = int(yayhash(n));
    o = 
	    o == 0?0xc0:
	    o == 1?0xe0:
	    o == 2?0X70:
	    o == 3?0x38:
	    o == 4?0x1c:
	    o == 5?0x0e:
	    o == 6?0x7:
	    o == 7?0x3:0
	    ;
    float d = mod(float(o/int(pow(2.,float(r>0?m:7-m)))),2.);
    gl_FragColor = vec4( vec3(.21+(d*.2),.15+(d*.21),.48+(d*.21)),1 );

}