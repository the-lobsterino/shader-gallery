#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

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

float draw ( float map)
{
	return smoothstep(0.001, 0.0, map);
}

void main( void ) {

	vec2 world= ( gl_FragCoord.xy / resolution.xy ) - vec2(.5);
	world *= vec2(1,resolution.y/resolution.x);
	world *= 3.0;
	
	vec2 size = vec2(.15+sin(time)*.1,.15);
	
	float map = min ( SdfCircle(world -size , .025), SdfCircle(world +size , .025) );
	map = min ( map, SdfCircle(world -vec2(-size.x,size.y) , .025) );
	map = min ( map, SdfCircle(world -vec2(size.x,-size.y) , .025) );
	map = max(-map,SdfRoundedBox( world, size, vec4(.01,.01,.01,.01)));
				      

	gl_FragColor = vec4( world.x+draw(map+.005)*.75 ,world.y+draw(map+.015)*.75, draw(map)*.75 , 1.0);
	gl_FragColor +=  vec4 ( (draw(map)-draw(map+.015)) * pow(1.0-abs(world.x),8.0) ) * vec4(1.0,0.75,0.25,1.0);
	gl_FragColor -= draw(map+.015) * ((world.y+.15)*3.0);
	gl_FragColor = vec4(map);

}