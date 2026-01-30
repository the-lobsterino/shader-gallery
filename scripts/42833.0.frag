#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool test(float coord, float step, float thin)
{
  return mod(coord, step + thin) < thin;
}

void main( void ) {

	vec2 gsTexCoord = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
	vec2 pixel = gsTexCoord * resolution;
	
	vec2 size = vec2(32,32);//vec2(32, 32);
	vec2 dist = vec2(16,32);//vec2(32, 32);
	vec2 totalLen = size + dist;
	vec2 sd = size / totalLen;
		

	bool testX = mod(pixel.x, totalLen.x + totalLen.x) < totalLen.x;
	bool testY = mod(pixel.y, totalLen.y + totalLen.y) < totalLen.y;	
	float fx = fract(pixel.x / totalLen.x);
	float fy = fract(pixel.y / totalLen.y);
	if(fx > sd.x || fy > sd.y) discard;
	
	if(testX != testY)
	{
		float ix = mod(pixel.x, size.x);
		//float cx = pixel.x - ix * size.x;
		float tileX = fract(ix / size.x);
		float tileY = fract(pixel.y / size.y);
		gl_FragColor = vec4(tileX, tileY, 0.0, 1.0);
	}	

}