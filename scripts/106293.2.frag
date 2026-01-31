#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

#define MAXHEIGHT 1000.
#define MAXSPEED 100.
#define NUMNEIGHBOURS 4


float getHeight(float x, float y){
	float v = texture2D(backbuffer, vec2(x,y)).g;
	return (v-0.5)*MAXHEIGHT*2.;
}
float getSpeed(float x, float y){
	float v = texture2D(backbuffer, vec2(x,y)).b;
	return (v-0.5)*MAXSPEED*2.;
}
float height2value(float h)
{
	if (abs(h) > MAXHEIGHT)
	{
		if (h>0.) return MAXHEIGHT;
		else return 0.;
	}
	else {
		return ((h/MAXHEIGHT)/2.)+0.5;
	}
}
float speed2value(float v)
{
	if (abs(v) > MAXSPEED)
	{
		if (v>0.) return MAXSPEED;
		else return 0.;
	}
	else {
		return ((v/MAXSPEED)/2.)+0.5;
	}
}



float getAcc(float x, float y, float currentHeight)
{
	float acc = 0.;
	
	vec2 neighbours[NUMNEIGHBOURS];
	vec2 pixel = 1./resolution;
	
	neighbours[0] = pixel * vec2(0.,1.);
	neighbours[1] = pixel * vec2(0.,-1.);
	neighbours[2] = pixel * vec2(0.,2.);
	neighbours[3] = pixel * vec2(-0.,-2.);

	for (int i = 0; i < NUMNEIGHBOURS; i++)
	{
		vec2 neighbour = neighbours[i];
		float nHeight = getHeight(x+neighbour.x,y+neighbour.y);
		acc += 0.05*(nHeight - currentHeight);
	}
	
	acc += 0.0005*-(currentHeight);
	
	return acc;
	 
}




void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float x = position.x;
	float y = position.y;
	
	float height = getHeight(x,y);
	float speed = getSpeed(x,y);
	
	if (distance(mouse, position) < 0.005)
	{
		height = 900.;
		speed = -100.;
	}
	else
	{
		//get the acceleration
		float acc = getAcc(x,y,height);
		
		//update the velocity
		speed += acc;
		
		//update the pos
		height += speed;
	}
	
	
	gl_FragColor = vec4( vec3( 0., height2value(height), speed2value(speed)), 1.0 );

}