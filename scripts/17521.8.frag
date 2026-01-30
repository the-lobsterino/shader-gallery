#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co) {return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);}
float PI = 3.1415926535;
vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}
vec3 lineColor(float i) { return rgb(241.,165.,56.) + .08*vec3( rand(vec2(i+0.,i+2.2))*2.-1., rand(vec2(i+.2,i+3.))*2.-1., rand(vec2(i+8.,i+2.))*2.-1. ); }

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	p.x = p.x * resolution.x/resolution.y;
	float dist = sqrt(p.x*p.x + p.y*p.y);
	
	// determine angle of current position (0..2pi, zero is up)
	float a = atan(p.x,p.y);
	if (a<0.){a=a+PI*2.;}
	
	// color background
	vec3 col = rgb(22.,14.,37.); // background
	if (mod(a,PI/20.)<PI/40.) {
		col = col+rgb(255.,255.,255.)*.09 - dist*.03; // rays
	}
	col = col*(2.4-dist*.9); // "vignette"
	
	// TRIANGLE
	float triX = p.x; 
	float triY = p.y-.165;
	float triSize = .5;
	float triSlope = 1.7;
	if ( (triX<.002 && triY>-triSize && triY<triX*triSlope+triSize) || (triX>-.002 && triY>-triSize && triY<-triX*triSlope+triSize) ) {
		col = rgb(234.,128.,3.)*(dist*1.3+.6);
	}
	
	// EYE
	if ( p.y>2.0*p.x*p.x-.19 && -p.y>2.6*p.x*p.x-.19 ) {
		col = vec3(.9);
	}
	// iris
	float eyeX = p.x; 
	float eyeY = p.y;
	float eyeDist = sqrt(eyeX*eyeX + eyeY*eyeY);
	if (eyeDist<.15) {col = vec3(.1);}
	// pupil
	eyeX = p.x; 
	eyeY = p.y;
	eyeDist = sqrt(eyeX*eyeX + eyeY*eyeY);
	if (eyeDist<.08) {col = vec3(.4);}
	// hilight
	eyeX = p.x-.06; 
	eyeY = p.y-.07;
	eyeDist = sqrt(eyeX*eyeX + eyeY*eyeY);
	if (eyeDist<.03) {col = vec3(.7);}
	
	// "PIXELATE" BG
	float cellAmount = 60.; // amount of cells (x,y)
	float b = rand(vec2( floor(p.x*cellAmount)/cellAmount, floor(p.y*cellAmount)/cellAmount ));
	col = col+b*.2-.2;
	
	// CIRCLING LINES
	float dLine,lineStartAngle,lineOffsetAngle,dir;
	float lineWidth = 0.015;
	float speed = .058;
	
	for (float i=0.;i<30.;i++) {
		// determine line position, length and width
		dLine = i*.06 + .24 + rand(vec2(i,i+3.))*.03-.015;
		lineStartAngle = rand(vec2(i+3.,i+4.))*PI*2.;
		lineOffsetAngle = rand(vec2(i+8.,i+6.))*PI*1.5+.3;
		
		// animate line
		dir = (mod(i,2.)-.5)*2.; // 1 or -1
		speed += rand(vec2(i+.31,i+.32))*.06-.03;
		lineStartAngle = mod(lineStartAngle+time*speed*dir, PI*2.);
		
		// determine line color
		if ( dist<dLine && dLine<dist+lineWidth) {
			if (lineStartAngle+lineOffsetAngle > PI*2.) {
				if (a > lineStartAngle || a < lineStartAngle+lineOffsetAngle - PI*2.) {
					col = lineColor(i);
				}
			} else {
				if (a > lineStartAngle && a < lineStartAngle+lineOffsetAngle) {
					col = lineColor(i);
				}
			}
		}
	}
	
	gl_FragColor = vec4( col, 1.0);
}