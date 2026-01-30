#ifdef GL_ES
precision mediump float;
#endif


// Ok, I realized the crazy bug. 
// Sometimes you make a shader, no matter how much simple and the Save button doesn't respond. It doesn't save, it doesn't dissapear.
// Then you change something and it saves.

// It seems to have to do with the snapshot creation/save
// Like when the pattern is crazy, save button does not work, maybe jpeg/png/whatever bigger than allowed?
// So, in this animation you can save and not save when it changes between two screens.  

//
// Thanks to the original author for this awesome shader. Added a spinning segment.
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.x ) - vec2(0.5, 0.5 * (resolution.y / resolution.x));

	float r = length(pos);
	float a = atan(pos.y, pos.x);
	float c = pow(sin(a * 68.0 + 32.0*time * sin((r)*32.0)/abs(sin(r*32.0))) * 0.5 +0.5, 2.0) * pow(sin(r * 32.0), 2.0) * r;

	vec4 color = vec4(0.0, 0.0, 0.15, 0.0);
	color += vec4(2.0 * c, 2.0 * c, 2.0 * c, 1.0 * c);
	
	//if (sin(time) > 0.5) color *= vec4(c);
	
	gl_FragColor = color;
}