#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ellipse( in vec2 p, in float x, in float y, in float dirx, in float diry, in float radx, in float rady )
{
	vec2  q = p - vec2(x,y);
	float u = dot( q, vec2(dirx,diry) );
	float v = dot( q, vec2(diry,dirx)*vec2(-1.0,1.0) );
	return dot(vec2(u*u,v*v),vec2(1.0/(radx*radx),1.0/(rady*rady)))-1.0;
}

float box( in vec2 p, in float x, in float y, in float dirx, in float diry, in float radx, in float rady )
{
	vec2  q = p - vec2(x,y);
	float u = dot( q, vec2(dirx,diry) );
	float v = dot( q, vec2(diry,dirx)*vec2(-1.0,1.0) );
	vec2  d = abs(vec2(u,v)) - vec2(radx,rady);
	return max(d.x,d.y);
}

float fillEllipse( in vec2 p, in float x, in float y, in float dirx, in float diry, in float radx, in float rady )
{
	float d = ellipse(p,x,y,dirx,diry,radx,rady);
    float w = fwidth(d);
	return 1.0 - smoothstep( -w, w, d);
}

float strokeEllipse( in vec2 p, in float x, in float y, in float dirx, in float diry, in float radx, in float rady, in float thickness )
{
	float d = abs(ellipse(p,x,y,dirx,diry,radx,rady)) - thickness;
    float w = fwidth(d);
	return 1.0 - smoothstep( -w, w, d);
}


float fillRectangle( in vec2 p, in float x, in float y, in float dirx, in float diry, in float radx, in float rady )
{
	float d = box(p,x,y,dirx,diry,radx,rady);
    float w = fwidth(d);
	return 1.0 - smoothstep( -w, w, d);
}


float logo( vec2 p )
{
	p *= 0.66;
	p.x = abs(p.x);
	
    vec2 q = p;	
	
	
	float f = 1.0;
	
	f = mix( f, 0.0,     fillEllipse(   q, 0.000, 0.000,  1.0, 0.0, 0.800, 0.444) );
	f = mix( f, 1.0,     fillEllipse(   q, 0.260, 0.100,  1.0, 0.0, 0.150, 0.167) );
	f = mix( f, 1.0,     fillRectangle( p, 0.180, 0.400,  1.0, 0.0, 0.070, 0.100) );
	f = mix( f, 1.0,     fillRectangle( p, 0.000, 1.400,  1.0, 0.0, 0.040, 0.040) );
	f = mix( f, 1.0,     fillRectangle( p, 0.036, 1.448,  0.6, 0.8, 0.065, 0.057) );
	f = mix( f, 1.0,     fillEllipse(   q, 0.200,-1.450,  1.0, 0.0, 0.200, 0.333) );
	f = mix( f, 1.0,     fillEllipse(   q, 0.400,-1.350, -0.8, 0.6, 0.150, 0.278) );
        f = mix( f, 0.0, 1.0-fillEllipse(   p, 0.000, 0.000,  1.0, 0.0, 1.000, 0.556) );
	f = mix( f, 0.0,     strokeEllipse( p, 0.000, 0.000,  1.0, 0.0, 0.950, 0.528, 0.06) );

	return f;
}


  
/*(-1,1)      (1,1)
        .......
        .     .
        .     .
        .     .
(-1,-1) ....... (1,-1)

*/

float ray( vec2 pos, vec2 center ) {
	
	vec2 p = pos - vec2(0.5, 0.5);
	
	if (p.x < center.x + 0.2 && p.x > center.x - 0.2 &&
	    p.y < center.y + 0.2 && p.y > center.y - 0.2
	   ) {
		return 1.0 - (distance(p, center) * 5.0);
	} else {
		return 0.0;
	}
	
}

float determinant(mat2 pivot) {
	return pivot[0].x * pivot[1].y - pivot[0].y * pivot[1].x;
}


float legs(vec2 pos, vec2 center) {
	
	
	
	center += vec2(0.5, 0.5);
	
	if (length(pos) * 0.9 > length(center)) {
		return 0.0;
	}
	
	
	vec2 predicular = vec2( center.y, -center.x ) * 0.15 / length(center);
	
	vec2 left = center + predicular;
	vec2 right = center - predicular;
	
	mat2 pivot1, pivot2, pivot;
	
	pivot1[0] = pos;
	pivot1[1] = left;
	
	pivot2[0] = pos;
	pivot2[1] = right;
	
	pivot[0] = pos;
	pivot[1] = center;
	
	
	
	
	//if ((pos.x > center.x + 0.3 && pos.y > center.y + 0.3) && distance(pos, center) > 0.4) {
	//	return 0.0;
	//}
	
	if (determinant( pivot1 ) < 0.0 && determinant( pivot2) > 0.0) {
		if (determinant(pivot) > 0.0) {
			return 1.0 - determinant(pivot) * 6.0;
		} else {
			return 1.0 + determinant(pivot) * 6.0;
			
		}
		
	} else {
		return 0.0;
	}
	
	
			
}

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy / resolution);
	
	vec3 yellow = vec3(249.0 / 256.0, 233.0 / 256.0, 137.0 / 256.0);
	
	float aspect = resolution.y / resolution.x;
	
	vec2 move = vec2( cos(time), sin(time) * aspect );
	
	position.x -= 0.5;
	position.y -= 0.5;	
	position   -= move / 5.0;
	position.y *= aspect;
	
	
	yellow *= max(0.2 * legs( (gl_FragCoord.xy / resolution), move / 5.0 ),
		      ray( (gl_FragCoord.xy / resolution), move / 5.0 ));
		      

	float color = logo(position * (10.0 + cos(time/1.4)));
		
	gl_FragColor = vec4( vec3( color ) + yellow, 1.0 );

}