#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

mat3 inverse(mat3 m) {
  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

  float b01 = a22 * a11 - a12 * a21;
  float b11 = -a22 * a10 + a12 * a20;
  float b21 = a21 * a10 - a11 * a20;

  float det = a00 * b01 + a01 * b11 + a02 * b21;

  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
              b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
              b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
}

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

void main( void ) {
	
	vec2 screen_space_mouse_position = mouse * resolution;
	vec2 screen_space_center = vec2(0.5, 0.5) * resolution;
	vec3 curpos = vec3(gl_FragCoord.xy - screen_space_mouse_position, 0.0);
	
	// yzx order
	vec3 e = vec3(screen_space_mouse_position.x * 0.0025, screen_space_mouse_position.y * 0.0025, 0.0);
	float sa = sin(e.z);
	float ca = cos(e.z);
	float sb = sin(e.x);
	float cb = cos(e.x);
	float sh = sin(e.y);
	float ch = cos(e.y);
	
	mat3 m = inverse(mat3(
		ch * ca, 
		-ch * sa * cb + sh * sb, 
		ch * sa * sb + sh * cb,
		
		sa, 
		ca * cb, 
		-ca * sb,
		
		-sh * ca, 
		sh * sa * cb + ch * sb, 
		-sh * sa * sb + ch * cb
	));
	vec3 box1_position = m * curpos;
	vec3 box2_position = m * (curpos + vec3(180, 60, 0.0));
	
	vec3 box1_scale = vec3(100., 100., 100.);
	vec3 box2_scale = vec3(50., 40., 30.);
	
	float box1_silouette = sdBox(box1_position, box1_scale);
	float box2_silouette = sdBox(box2_position, box2_scale);
	
	float merged_silouette = smin(box1_silouette, box2_silouette, 10.0);
	
	vec3 box1_color = vec3(1.0, 0.0, 0.5) * box1_silouette;
	vec3 box2_color = vec3(0.0, 1.0, 0.0) * box2_silouette;
	
	vec3 merged_color = box1_color + box2_color;
	
	gl_FragColor = vec4(merged_color * merged_silouette, 1.0);

}