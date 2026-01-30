#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159;

float SdfCircle ( vec2 world, float radius)
{
	float s = 0.0;
	s= length(world)-radius;
	return s;
}

float SdfRoundedBox( vec2 p, vec2 b, vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float opSmoothUnion( float d1, float d2, float k ) 
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float draw ( float map)
{
	return smoothstep(0.001, 0.0, map);
}

vec2 rotate(vec2 world, float rotation){
	float angle = rotation * PI * 2.0 * -1.0;
	float sine = sin(angle);
	float cosine = cos(angle);
	return vec2(cosine * world.x + sine * world.y, cosine * world.y - sine * world.x);
}

void main( void ) {

	vec2 world= ( gl_FragCoord.xy / resolution.xy ) - vec2(.5);
	world *= vec2(1,resolution.y/resolution.x);
	world *= 3.0;
	
	vec2 size = vec2(.15+sin(time)*.1,.15);
	
	float map = min ( SdfCircle(world -size , .025), SdfCircle(world +size , .025) );
	map = min ( map, SdfCircle(world -vec2(-size.x,size.y) , .025) );
	map = min ( map, SdfCircle(world -vec2(size.x,-size.y) , .025) );
	map = max(-map,SdfRoundedBox( world, size, vec4(.01)));
	map = opSmoothUnion( map , SdfRoundedBox(rotate(world - vec2(-.5,0),fract(time*.05)), vec2(.25),vec4(.001+abs(sin(time*.25))*.2)), .1 );
				      

	vec4 outCol = vec4( world.x+draw(map+.005)*.75 ,world.y+draw(map+.015)*.75, draw(map)*.75 , 1.0);
	outCol +=  vec4 ( (draw(map)-draw(map+.015)) * pow(1.0-abs(world.x),8.0) ) * vec4(1.0,0.75,0.25,1.0);
	outCol -= draw(map+.015) * ((world.y+.15)*3.0);

	vec4 debug = vec4(mix(vec4(1.0,0.0,0.0,1.0), vec4(0.0,0.5,0.0,1.0), step(0.0,map)));
	float mval = (mouse.y*.1)+.1;
	mval = .1;
   	debug *= smoothstep(.045, .05, abs(fract(map / mval)));
	debug *= smoothstep(.075, .1, abs(fract(map / (mval/5.0))))+.25;
	//debug.b = 1.0-map;
	
	gl_FragColor = mix(debug,outCol,clamp(mouse.x*2.0,0.0,1.0)); //left is debug - right is final

}