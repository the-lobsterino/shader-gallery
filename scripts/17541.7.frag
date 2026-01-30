#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Mapping HSB to only two axes sucks. I've mapped saturation to the x-axis
// and hue to the y-axis and you can see the resulting color in various 
// brightness levels on the left. It's unintuitive, which illustrates why
// color pickers are not meant to be implemented using only a fragment shader :P

vec3 rgb(float r, float g, float b) {return vec3(r/255.,g/255.,b/255.);}

vec3 hueToRgb(float h) {
	vec3 col;
	if (h<60.) {
		col = rgb(255., h/60.*255., 0.);
	} else if (h<120. && h>60.) {
		col = rgb( (-(h-60.)/60.+1.)*255., 255., 0. );
	} else if (h<180. && h>120.) {
		col = rgb( 0., 255., ((h-120.)/60.)*255. );
	} else if (h<240. && h>180.) {
		col = rgb( 0., (-(h-180.)/60.+1.)*255., 255. );
	} else if (h<300. && h>240.) {
		col = rgb( ((h-240.)/60.)*255., 0., 255. );
	} else {
		col = rgb( 255., 0., (-(h-300.)/60.+1.)*255. );
	}
	return col;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	// prevent breaking when passing zero
	float my = mouse.y;
	if (my == .5) {my = .50001;}
	
	vec3 col;
	float hueBar = .1; // hue bar width
	float briBar = .1; // brightness bar width
	
	
	// draw hues on the right
	if (p.x > 1.-hueBar) {
		col = hueToRgb( p.y*360. );
	
	// draw results on the left
	} else if (p.x < briBar) {
		
		vec3 rgbHue = hueToRgb( my*360. );
		float s = (mouse.x-briBar)/(1.-briBar-hueBar);
		float b = floor( p.y*12. )/12.;
		col = b*(vec3(1.)-s*vec3(1.-rgbHue));
		
	// draw brightness-saturation field in the middle
	} else {
		
		vec3 rgbHue = hueToRgb( my*360. );
		float s = ((p.x-briBar)/(1.-hueBar-briBar));
		float b = p.y;
		
		col = b*(vec3(1.)-s*vec3(1.-rgbHue));
	}
	

	gl_FragColor = vec4( vec3(col), 1.0 );

}