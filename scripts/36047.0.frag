//After following Brandon Fogerty tutorial on raymarching (http://xdpixel.com/) this is my attempt to extend it a little bit.
//Im sure there are a lot of mistakes but, Im glad since Im finally understanding this technique.
//Im not using any sort of light, im just fading the colors depending on their distance.
//If you want to see my stuff visit my site at: codeartist.mx

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
vec3 positionArray[4];
vec3 colorArray[4];
vec3 currentColor;

float maxDepth=15.0;
float speed=0.5;
float amplitude=4.0;
float radius=1.25;

float sphere( vec3 p, float radius, vec3 pos)
{
    return length( p+pos ) - radius;
}

float map( vec3 p )
{
	float cosValue=cos(time*speed)*amplitude;
	float sinValue=sin(time*speed)*amplitude;
	currentColor=vec3(0,0,0);
	positionArray[0]=vec3(sinValue,0.0,cosValue);
	positionArray[1]=vec3(-cosValue,sinValue,sinValue);
	positionArray[2]=vec3(0.0,cosValue,-sinValue);
	positionArray[3]=vec3(cosValue,-cosValue,sinValue);
	colorArray[0]=vec3(1,0,0);
	colorArray[1]=vec3(0,1,0);
	colorArray[2]=vec3(0,0,1);
	colorArray[3]=vec3(1,1,0);
	float tempDist;
	float minDist=1.0/0.0; 
	for(int i=0;i<4;i++){
		tempDist=sphere( p, radius,positionArray[i]);
		if(tempDist<minDist){
			minDist=tempDist;
			currentColor=colorArray[i];
		}
		
	}
    return minDist;
}

float trace( vec3 origin, vec3 direction )
{
    float totalDistanceTraveled = 0.0;

    for( int i=0; i <128; ++i)
    {
        vec3 p = origin + direction * totalDistanceTraveled;
	float distanceFromPointOnRayToClosestObjectInScene = map( p );
        totalDistanceTraveled += distanceFromPointOnRayToClosestObjectInScene;
        if( distanceFromPointOnRayToClosestObjectInScene < 0.0001 )
        {
            break;
        }
        if( totalDistanceTraveled > 10000.0 )
        {
            totalDistanceTraveled = 0.0;
            break;
        }
    }

    return totalDistanceTraveled/maxDepth;
}
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) 
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    vec3 cameraPosition = vec3( 0.0, 0.0, -5.0 );
    vec3 cameraDirection = normalize( vec3( uv.x, uv.y, 1.0) );
    float dist = trace( cameraPosition, cameraDirection );
    vec3 finalColor;
	if(dist>0.1)
    	 finalColor = vec3(currentColor* 1.0-dist);
	else
          finalColor = vec3(uv.x+uv.y+1.0)*0.1;
    gl_FragColor = vec4( finalColor, 1.0 );
}