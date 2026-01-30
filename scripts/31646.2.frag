// !-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-
// *Original Found At 
//	https://www.shadertoy.com/view/lstSWr
// By hubbe 
// !-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define iResolution resolution
#define iGlobalTime time
int iFrame = int( time * 0.001 );
vec4 iMouse = vec4( mouse, vec2(0.0, 0.0) );

void mainImage( out vec4 fragColor, in vec2 fragCoord );
void main( void ) { mainImage( gl_FragColor, gl_FragCoord.xy ); }

// !-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-
// *Original Found At 
//	https://www.shadertoy.com/view/lstSWr
// By hubbe 
// !-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-!-!~*-

// Ball radius
#define R 0.069

// Tangent distance map.
// 
// If "tangent_distance" is true, then the map is allowed to return distances greater
// than the distance to the surface, as long as the distance returned doesn't skip out
// the other side of an object again.
float map(vec3 p, bool tangent_distance) {
    // This makes everything below repeat infinitely.
    p = mod(p, 0.5) - vec3(0.25);

    // Distance to center of ball, squared.
    float l2 = dot(p, p);
    
    if (l2 >= R*R && tangent_distance) {
        // By returning the distance to the horizon of the ball, as seen from point p,
        // (henchforth known as the tangent distance) we guarantee that we don't step
        // through the ball. Unlike a regular distance map, this will often put us inside
        // the surface, so the marching function has to handle that. However, the extra
        // step size allows for larger viewing distances with little or no extra cost.
        return sqrt(l2 - R*R);
    }
    
    // Fall back on a regular distance map.
    return sqrt(l2) - R;
}

// Cast a ray starting at "from" and keep going until we hit something or
// run out of iterations.
float ray(vec3 from, vec3 direction) {
    // How far we travelled (so far)
    float travel_distance = 0.0;
    float last_travel_distance = 0.0;
    bool hit = false;
    for (int i = 0; i < 50; i++) {
        // calculate the current position along the ray
	    vec3 position = from + direction * travel_distance;
	    float distance_to_closest_object = map(position, !hit);

        if (distance_to_closest_object < 0.0001) {
        	if (distance_to_closest_object < 0.0) {
                // We are inside of an object. Go back to the
                // previous position and stop using tangent distances
                // so that we can find the surface.
            	hit = true;
          	    travel_distance = last_travel_distance;
           	    continue;
            }
            return travel_distance;
        }
        last_travel_distance = travel_distance;
        
        // We can safely advance this far since we know that the closest
        // object is this far away. (But possibly in a completely different
        // direction.)
        travel_distance += distance_to_closest_object;
    }
    // We hit something, but then we ran out of iterations while
    // finding the surface.
    if (hit) return travel_distance;
    // We walked 50 steps without hitting anything.
    return 0.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy - iResolution.xy / 2.0) / iResolution.xx;

    vec3 camera_position = vec3(0, 0, -1);

    // Animate
    camera_position.z += iGlobalTime/2.0;
    camera_position.x += iGlobalTime/7.0;
    
    // Note that ray_direction needs to be normalized.
    // The "1" here controls the field of view.
    float zoom = 1.0;
    
    // Uncomment this for a very funky zoom effect.
    // float zoom = sin(iGlobalTime / 5.0) + 0.4; <- original line of code
    //zoom = (3.15192*0.5-uv.y/uv.x)/length(uv); // zoom += 2. * sin(time); // bpt.2016 
	
    vec3 ray_direction = normalize(vec3(uv, zoom));

	// Direction of the sun.
    vec3 sun_direction = normalize(vec3(0.2, 1, -1));
        
    // Cast a ray, see if we hit anything.
    float travel_distance = ray(camera_position, ray_direction);
    
    // If we didn't hit anything, go with black.
    if (travel_distance == 0.0) {
        fragColor = vec4(0);
        return;
    }

    // Point in space where our ray intersects something.
    vec3 hit_position = camera_position + ray_direction * travel_distance;

    // Distance from surface.
    float surface_dist = map(hit_position, false);
    
    // How far we step towards the sun.
    float sun_ray_step_length = 0.005;
    
    // Take a small step in the direction of the light source and measure how
    // far we are from the surface. The further away we got, the brighter this
    // spot should be.
    float surface_dist_nearer_sun = map(hit_position + sun_direction * sun_ray_step_length, false);
    
    // Calculate how much sunlight is falling on this spot (hit_position).
    float sunlight = max(0.0, (surface_dist_nearer_sun - surface_dist) / sun_ray_step_length);

    // Reduce the sunlight with distance to make it fade out far away.
    sunlight /= (1.0 + travel_distance * travel_distance * 0.2);
    
    // Alternate blue and orange balls using magic.
    float n = dot(vec3(1.0), floor(hit_position * 25.0));
    if (mod(n, 2.0) == 0.0) {    
    	// Blue palette.
    	fragColor = vec4(sunlight * sunlight * 0.3, sunlight, sunlight * 1.5, 1.0);
    } else {
        // Fire palette.
    	fragColor = vec4(sunlight * 1.5, pow(sunlight, 2.5), pow(sunlight, 12.), 1.0);
    }	
}
