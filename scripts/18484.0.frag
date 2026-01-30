#ifdef GL_ES
precision mediump float;
#endif

// TRY THIS IN HIGHER RESOLUTION -- HAS LESS FLICKER

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
float PI = 3.141592653589793238462643383279502884197169399375105820974944;
vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy/resolution.xy )*2.-1.;
	float dist = sqrt(pos.x*pos.x + pos.y*pos.y);
	// correct aspect ratio
	float aspect = resolution.x/resolution.y;
	pos.x = pos.x*aspect;
	pos.y = pos.y;
	
	float sector = 0.; // clockwise, starting from right
	if ( pos.x>abs(pos.y) )           {sector = 1.;} // right
	else if ( abs(pos.x)>abs(pos.y) ) {sector = 3.;} // left
	else if (pos.y<0.)                {sector = 2.;} // bottom
	else                              {sector = 4.;} // top
	
	float speed = .04;
	vec3 col = rgb(22.,14.,37.); // background color
	
	// LINEBOXES
	float d = .14;
	float s = .04;
	
	// animate boxes
	float x = pos.x + pos.x/abs(pos.x)*time*speed;
	float y = pos.y + pos.y/abs(pos.y)*time*speed;
	
	// colors
	vec3 hilight = rgb(231.,177.,13.);
	vec3 col1  = rgb(241.,165.,56.)*(1.4-dist); // right
	vec3 col2 = rgb(162.,98.,6.)*(1.4-dist);
	
	float hit = 0.;
	float ringNo = 0.;
	if ( abs(x) < d*abs(y)*(1./d) && mod(abs(y), d)>(d-s) ) {
		hit = 1.;
		ringNo = floor(abs(y)/d);
	} else if ( abs(y) < d*abs(x)*(1./d) && mod(abs(x), d)>(d-s) ) {
		hit = 1.;
		ringNo = floor(abs(x)/d);
	}
	
	// highlights
	if      (hit>.5 && sector<1.5 && mod(ringNo,4.)<.5) {col=hilight;} // right
	else if (hit>.5 && sector>1.5 && sector<2.5 && mod(ringNo,5.)>3.5 && mod(ringNo,5.)<4.5) {col=hilight;} // bottom
	else if (hit>.5 && sector>2.5 && sector<3.5 && mod(ringNo,10.)>2.5 && mod(ringNo,10.)<3.5) {col=hilight;} // left
	else if (hit>.5 && sector>3.5 && sector<4.5 && mod(ringNo,6.)>1.5 && mod(ringNo,6.)<2.5) {col=hilight;} // top
	
	// other boxes
	else if (hit>.5 && mod(ringNo,2.)<.5) {col=col1;}
	else if (hit>.5 && mod(ringNo,2.)>.5) {col=col2;}
	
	// darken sides
	if (sector < 1.5) {
		col = col*.8;
	} else if (sector > 2.5 && sector <3.5){
		col = col*.8;
	}
	
	gl_FragColor = vec4(col, 1.);

}