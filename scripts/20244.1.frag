#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 repeat( vec3 pos )
{
	return mod( pos, 8.0 ) - 4.0;
}

float distanceFunc( vec3 pos )
{
	return length( repeat( pos ) ) - ( ( cos( time ) + 1.0 ) / 2.0 );
}

vec3 getNormal(vec3 p)
{
  const float d = 0.0001;
  return
    normalize
    (
      vec3
      (
        distanceFunc(p+vec3(d,0.0,0.0))-distanceFunc(p+vec3(-d,0.0,0.0)),
        distanceFunc(p+vec3(0.0,d,0.0))-distanceFunc(p+vec3(0.0,-d,0.0)),
        distanceFunc(p+vec3(0.0,0.0,d))-distanceFunc(p+vec3(0.0,0.0,-d))
      )
    );
}

void main(void){
	vec2 pos = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / resolution.y;
	
	vec3 camPos = vec3( 0.0, 0.0, 3.0 );
	vec3 camDir = vec3( 0.0, 0.0, -1.0 );
	vec3 camUp = vec3( 0.0, 1.0, 0.0 );
	vec3 camSide = cross( camDir, camUp );
	float focus = 1.8;
	
	vec3 rayDir = normalize( camSide * pos.x + camUp * pos.y + camDir * focus );
	
	float t = 0.0, d;
	vec3 currentPos = camPos;
	for( int i = 0; i < 64; ++i ) {
		d = distanceFunc( currentPos );
		
		t += d;
		currentPos = camPos + t*rayDir;
	}
	
	vec3 normal = getNormal( currentPos );
	if( abs(d) < 0.001 ) {
		gl_FragColor = vec4( normal, 1.0 );
	}
	else {
		gl_FragColor = vec4( vec3( 0.0 ), 1.0 );
	}
}