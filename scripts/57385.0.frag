#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define NUMOFBOXES 6
#define ZOOM 10.0
#define SCALE 3.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Box
{
	vec2 boxPosTL;
	vec2 boxPosBR;
};
	
Box boxes[NUMOFBOXES];

float drawLine(vec2 p1, vec2 p2, vec2 uv) {

  float a = abs(distance(p1, uv));
  float b = abs(distance(p2, uv));
  float c = abs(distance(p1, p2));

  if ( a >= c || b >=  c ) return 0.0;

  float p = (a + b + c) * 0.5;

  // median to (p1, p2) vector
  float h = 2.0 / c * sqrt( p * ( p - a) * ( p - b) * ( p - c));

  return mix(1.0, 0.0, smoothstep(0.5 * 0.004, 1.5 * 0.004, h));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void CreateBoxes()
{
	boxes[0].boxPosTL = vec2(0.0, 0.04) * SCALE;
	boxes[0].boxPosBR = vec2(0.07, 0.0)* SCALE;
	
	boxes[1].boxPosTL = vec2(0.0, 0.02)* SCALE;
	boxes[1].boxPosBR = vec2(0.02, -0.1)* SCALE;
	
	boxes[2].boxPosTL = vec2(0.0, -0.08)* SCALE;
	boxes[2].boxPosBR = vec2(0.04, -0.12)* SCALE;
	
	boxes[3].boxPosTL = vec2(0.03, -0.10)* SCALE;
	boxes[3].boxPosBR = vec2(0.06, -0.16)* SCALE;
	
	boxes[4].boxPosTL = vec2(0.05, -0.16)* SCALE;
	boxes[4].boxPosBR = vec2(0.07, -0.17)* SCALE;
	
	boxes[5].boxPosTL = vec2(0.06, 0.04)* SCALE;
	boxes[5].boxPosBR = vec2(0.08, -0.17)* SCALE;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	position *= ZOOM;
	
	vec3 color = vec3(1.0);
	
	CreateBoxes();
		
	vec3 trueCol = vec3(1.0);
	for(int i = 0; i < NUMOFBOXES; i++)
	{
		if(position.x < (boxes[i].boxPosBR.x + mouse.x * ZOOM) && position.x > (boxes[i].boxPosTL.x + mouse.x * ZOOM))
		{
			if(position.y < (boxes[i].boxPosTL.y + mouse.y * ZOOM) && position.y > (boxes[i].boxPosBR.y + mouse.y * ZOOM))
			{
				trueCol = vec3(0.0);
			}
		}
	}
	color = trueCol;
	
	
	//color += vec3(drawLine(vec2(0.04, -0.12),vec2(0.08, -0.16), position), drawLine(vec2(0.04, -0.12),vec2(0.18, -0.16), position), drawLine(vec2(0.04, -0.12),vec2(0.08, -0.16), position)) * ZOOM;

	gl_FragColor = vec4( color, 1.0 );

}