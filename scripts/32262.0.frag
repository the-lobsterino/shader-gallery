// 2D depth of field (not mine - see parent)
// Small fix done for my computer

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct result { 
	vec3 color;
	float distance;
};

vec3 cameraLocation() {
	return vec3(
		sin(time),
		0.0,
		sin(time / 3.0)
	);
}
	
// Returns the location of the current fragment relative to the center of the screen, where 0.5 is the distance to the nearest screen border.
// This will return values > +-0.5 on the X axis in widescreen, and the Y axis in portrait.
vec2 pixelCoord() { 
	return ((gl_FragCoord.xy - (resolution / 2.0)) / min(resolution.x, resolution.y)); 
}

// Returns a solid color an infinite distance away.
result background() {
	return result(
		vec3(0.2, 0.6, 1.0),
		1.0 / 0.0
	);
}

// Draws a rectangle, returning the given color if the current pixel is inside it, or the background if not.
result rectangle(vec3 origin, vec3 color) {
	origin -= cameraLocation();
	vec2 topRight = (origin.xy + 1.0) / origin.z;
	vec2 bottomLeft = (origin.xy - 1.0) / origin.z;
	
	if(pixelCoord().x > topRight.x) return background();
	if(pixelCoord().y > topRight.y) return background();
	if(pixelCoord().x < bottomLeft.x) return background();
	if(pixelCoord().y < bottomLeft.y) return background();
	
	return result(
		color,
		origin.z
	);
}

// Combines two rendered surfaces by taking the closest one.
result combine(result a, result b) {
	if(a.distance <= b.distance){
		return a;
	}

	return b;
}

// Wraps a given render result and gamma corrects it so it can be given to gl_FragCoord.
vec4 toScreen(result draw) {
	return vec4(
		pow(draw.color, vec3(1.0 / 2.2)),
		1.0
	);
}

void main( void ) {
	gl_FragColor = toScreen(
		combine(
			rectangle(vec3(0.0, 0.0, 5.0), vec3(1.0, 0.0, 0.0)),
			combine(
				rectangle(vec3(-5.0, 0.0, 15.0), vec3(1.0, 1.0, 0.0)),			
		       		rectangle(vec3(1.0, 0.25, 5.0 + sin(time * 2.0)), vec3(0.0, 1.0, 0.0))
			)
		)
	);
}