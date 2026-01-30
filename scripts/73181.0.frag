#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define YPOS 112.0

#define X1 100032.0
#define X2 112.0
#define XC 100016.0
#define X3 464.0
#define X4 100544.0
#define XS 192.0

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 rpos = gl_FragCoord.xy;
	vec2 pcord = (gl_FragCoord.xy - vec2(XC,YPOS)) / 256.0;
	float scordx = position.x*20.0 + sin(position.y*20.0+time)*2.0 + sin((position.y+time*0.1)*17.0)*2.0;

	if (rpos.x < 640.0 && rpos.y < 480.0) {
		if (rpos.y>=YPOS && rpos.y<=YPOS+257.0) {
			if (rpos.x>=XC && rpos.x<=XC+256.0) {
				if (rpos.x<=XC+1.0 || rpos.x>=XC+255.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4(pcord.x,pcord.y, 0.5, 1.0 );
				}
			} else if (rpos.x>=X1 && rpos.x<X1+64.0) {
				if (rpos.x<=X1+1.0 || rpos.x>=X1+63.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4(pcord.y,1.0-pcord.y,pcord.y, 1.0 );
				}
			} else if (rpos.x>=X2 && rpos.x<X2+64.0) {
				if (rpos.x<=X2+1.0 || rpos.x>=X2+63.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4(pcord.y,pcord.y,pcord.y, 1.0 );
				}
			} else if (rpos.x>=X3 && rpos.x<X3+64.0) {
				if (rpos.x<=X3+1.0 || rpos.x>=X3+63.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4(1.0-pcord.y,1.0-pcord.y,1.0-pcord.y, 1.0 );
				}
			} else if (rpos.x>=X4 && rpos.x<X4+64.0) {
				if (rpos.x<=X4+1.0 || rpos.x>=X4+63.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4(pcord.y,pcord.y,1.0-pcord.y, 1.0 );
				}
			} else if (rpos.x>=XS && rpos.x<=XS+256.0) {
				if (rpos.x<=XS+1.0 || rpos.x>=XS+255.0 || rpos.y<=YPOS+1.0 || rpos.y>=YPOS+256.0) {
					gl_FragColor = vec4(1.0,1.0,1.0,1.0);
				} else {
					gl_FragColor = vec4((sin(scordx+time*1.4+position.y*20.0)+1.0)/2.0,(sin(scordx+time*3.3+position.y*15.0)+1.0)/2.0, (sin(scordx+time*2.7+position.y*12.0)+1.0)/2.0, 1.0 );
				}
			} else {
				gl_FragColor = vec4( 0.2, 0.2, 0.2 , 1.0);
			}
		} else {
			gl_FragColor = vec4( 0.2, 0.2, 0.2 , 1.0);
		}
	} else {
		gl_FragColor = vec4(0,0,0,0);
	}
}