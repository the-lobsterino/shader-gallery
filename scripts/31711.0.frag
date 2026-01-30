// co3moz
// rotational square example 2

precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void) {
	//mat2 rotation = mat2(cos(time), -sin(time), sin(time), cos(time)); // this is a 2D rotation matrix
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y); // for squared tiles, we calculate aspect
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect; // position of pixel we need to multiply it with aspect, so we get squared tiles
	vec2 center = vec2(0.5) * aspect; // 0.5 is center but we need to multiply it with aspect
	
	//position *= rotation; // rotation of main position
	//center *= rotation; // we should rotate center to
	
	center += vec2(sin(time/200.0 * resolution.y), 0.0)/ 1.5; // movement
	float size = 0.15; // size of square
	float border = 0.003; // border of square
	
	float lengthX = length(position.x - center.x); // distance between position and center but only for x-axis
	float lengthY = length(position.y - center.y); // distance between position and center but only for y-axis
	
	gl_FragColor = vec4(vec3(((lengthX < size + border && lengthX > size - border) || (lengthY < size + border && lengthY > size - border)) && (lengthX + lengthY < size * 2.0)), 1.0);	
	
}