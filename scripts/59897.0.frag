/*
 * Original shader from: https://www.shadertoy.com/view/WtdGWB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// TODO: Add linear space lighting!
// TODO: Add little trees everywhere.
// TODO: Maybe animate day/night cycle.
// TODO: Add a moon with light.
// Could we place the camera on the mountains and make it look into the sky?
// TODO: Implement a mode that shows the different effects side by side.
// TODO: Implement max view distance (used for fog and ray marching).
// TODO: Step out of terrain using binary search.
// TODO: Use a more detailed height function only for shading (like for computing normals)! Ray march simpler geometry.
// TODO: Don't fade to black! Just use some ambient lighting.

// Settings:
const float gamma = 2.2;

const float max_view_distance = 10.0;

//const vec3 light_direction = normalize(vec3(0.5, 0.25, 0.25));
const float time_scale = 0.25;

//const vec3 sky_color = vec3(0.3, 0.7, 0.9);
const vec3 sky_color_noon = vec3(0.3, 0.7, 0.9);
const vec3 sky_color_evening = vec3(0.5, 0.3, 0.1);
const vec3 sky_color_night = vec3(0.1, 0.05, 0.15) * 2.0;

//vec3 light_color = vec3(1.0, 0.5, 0.2) * light_color_blend_factor;
const vec3 light_color_noon = vec3(1.0, 0.5, 0.2);
const vec3 light_color_evening = vec3(0.8, 0.1, 0.05);
const vec3 light_color_night = vec3(0.0);

const vec3 moon_color = vec3(0.05, 0.1, 0.1);


const float fog_strength = 0.11;
const float fog_exponent = 2.5;

const float water_height = 0.8;

const float terrain_height_multiplicator = 6.0;



float adjusted_time;
float adjusted_time_for_sun;

vec3 light_direction;
float light_exponent;

float is_day;

float noon_night_factor;	// 1.0 = noon, 0.0 = night
float noon_evening_factor;	// 1.0 = noon, 0.0 = evening

vec3 light_color;
vec3 sky_color;

vec2 fragCoord;

const int coordinate_count =  64;
vec3 coordinates[coordinate_count];


void initialize_global_variables(vec2 pFragCoord)
{
    // Initialize the array (since WebGL doesn't allow array initializers):
    coordinates[ 0 ] = vec3( -0.435885996181 , 0.79720633541 , 0.0972253052385 );
    coordinates[ 1 ] = vec3( -0.32218308746 , 0.100646505563 , 0.582645225292 );
    coordinates[ 2 ] = vec3( 0.587014777685 , 0.41111934478 , 0.547503737761 );
    coordinates[ 3 ] = vec3( -0.192455452266 , 0.321063732913 , 0.668652567224 );
    coordinates[ 4 ] = vec3( -0.259779617945 , 0.909626864008 , 0.0836824717262 );
    coordinates[ 5 ] = vec3( 0.348649506252 , 0.103790885936 , 0.904378113197 );
    coordinates[ 6 ] = vec3( -0.542650115811 , 0.0736718130349 , 0.397151757271 );
    coordinates[ 7 ] = vec3( -0.474716167394 , 0.118343120088 , 0.570445920116 );
    coordinates[ 8 ] = vec3( -0.836441325058 , 0.171629770526 , 0.0597544063084 );
    coordinates[ 9 ] = vec3( 0.0824315685125 , 0.505680845825 , 0.662611320344 );
    coordinates[ 10 ] = vec3( 0.516123186703 , 0.55815762739 , 0.411018332295 );
    coordinates[ 11 ] = vec3( -0.724799879376 , 0.423272250814 , 0.448164544035 );
    coordinates[ 12 ] = vec3( -0.0110437238687 , 0.0904558337167 , 0.231594212451 );
    coordinates[ 13 ] = vec3( 0.546531423419 , 0.321583514112 , 0.512659552736 );
    coordinates[ 14 ] = vec3( 0.368589954248 , 0.0182021895091 , 0.880833172129 );
    coordinates[ 15 ] = vec3( 0.47525253334 , 0.271287592025 , 0.000334496440065 );
    coordinates[ 16 ] = vec3( 0.44673660601 , 0.132552497011 , 0.340585192841 );
    coordinates[ 17 ] = vec3( -0.403804494418 , 0.0104325320551 , 0.159902664933 );
    coordinates[ 18 ] = vec3( -0.338579360521 , 0.716322524047 , 0.542091484806 );
    coordinates[ 19 ] = vec3( 0.308210916814 , 0.743567127819 , 0.472326208485 );
    coordinates[ 20 ] = vec3( 0.814788310063 , 0.449353375014 , 0.340846719572 );
    coordinates[ 21 ] = vec3( -0.544006155176 , 0.711118594385 , 0.132489899091 );
    coordinates[ 22 ] = vec3( -0.114345207769 , 0.0808582423255 , 0.0592533221037 );
    coordinates[ 23 ] = vec3( -0.0956105901715 , 0.886967062617 , 0.296750041926 );
    coordinates[ 24 ] = vec3( 0.125465786235 , 0.249375761939 , 0.39086839732 );
    coordinates[ 25 ] = vec3( -0.507001597684 , 0.478280151596 , 0.442128006659 );
    coordinates[ 26 ] = vec3( 0.767372362554 , 0.34981180972 , 0.216480512037 );
    coordinates[ 27 ] = vec3( 0.729037025717 , 0.488650315003 , 0.0447790563882 );
    coordinates[ 28 ] = vec3( 0.545055293632 , 0.328506679918 , 0.0161990255662 );
    coordinates[ 29 ] = vec3( 0.0613031135758 , 0.891064511104 , 0.391832390956 );
    coordinates[ 30 ] = vec3( 0.490558372066 , 0.237016279151 , 0.0603644616935 );
    coordinates[ 31 ] = vec3( 0.0670590641368 , 0.150548596978 , 0.496247392186 );
    coordinates[ 32 ] = vec3( 0.342684862582 , 0.682876750055 , 0.151397259036 );
    coordinates[ 33 ] = vec3( -0.651487774333 , 0.201712081807 , 0.246829681649 );
    coordinates[ 34 ] = vec3( 0.561837936205 , 0.251550371306 , 0.355580475726 );
    coordinates[ 35 ] = vec3( 0.192999232894 , 0.392428615732 , 0.0121078124268 );
    coordinates[ 36 ] = vec3( -0.105851736143 , 0.163824018243 , 0.236916795307 );
    coordinates[ 37 ] = vec3( -0.0611750509214 , 0.224873171348 , 0.617895466387 );
    coordinates[ 38 ] = vec3( -0.109924322491 , 0.508071654989 , 0.505581327183 );
    coordinates[ 39 ] = vec3( -0.706387045519 , 0.0671452123745 , 0.459796670999 );
    coordinates[ 40 ] = vec3( -0.278160406844 , 0.289551453062 , 0.160872443354 );
    coordinates[ 41 ] = vec3( 0.516576843643 , 0.817085834323 , 0.190027033479 );
    coordinates[ 42 ] = vec3( -0.0942554687146 , 0.878813661213 , 0.214972046973 );
    coordinates[ 43 ] = vec3( -0.221374373075 , 0.803633365667 , 0.299755346538 );
    coordinates[ 44 ] = vec3( -0.299462216003 , 0.0720235031843 , 0.36211897975 );
    coordinates[ 45 ] = vec3( 0.553343181571 , 0.493244437329 , 0.164447492472 );
    coordinates[ 46 ] = vec3( -0.20136124794 , 0.0760260274291 , 0.534534862455 );
    coordinates[ 47 ] = vec3( 0.905190222495 , 0.0807321460953 , 0.39235689531 );
    coordinates[ 48 ] = vec3( -0.728666867176 , 0.38048529455 , 0.226800106991 );
    coordinates[ 49 ] = vec3( -0.527457489355 , 0.367359870805 , 0.286014828375 );
    coordinates[ 50 ] = vec3( 0.325761364504 , 0.470935422995 , 0.770885656739 );
    coordinates[ 51 ] = vec3( -0.511384831071 , 0.50189485858 , 0.565409920223 );
    coordinates[ 52 ] = vec3( -0.518815864857 , 0.0632066994837 , 0.405086346674 );
    coordinates[ 53 ] = vec3( 0.115312716748 , 0.105398362421 , 0.954708709816 );
    coordinates[ 54 ] = vec3( -0.285700995513 , 0.0113348478119 , 0.4620339652 );
    coordinates[ 55 ] = vec3( -0.0374130136703 , 0.630623418764 , 0.577124020836 );
    coordinates[ 56 ] = vec3( 0.193453243995 , 0.355055361228 , 0.123825538219 );
    coordinates[ 57 ] = vec3( 0.681642806219 , 0.522843493246 , 0.489964036509 );
    coordinates[ 58 ] = vec3( -0.294839413327 , 0.557820363593 , 0.351222001041 );
    coordinates[ 59 ] = vec3( 0.577147207709 , 0.463873007553 , 0.356984090391 );
    coordinates[ 60 ] = vec3( -0.700910394348 , 0.213528376537 , 0.0842103964106 );
    coordinates[ 61 ] = vec3( -0.62990341948 , 0.559561713285 , 0.460576905302 );
    coordinates[ 62 ] = vec3( -0.097357826252 , 0.707750175458 , 0.258790836913 );
    coordinates[ 63 ] = vec3( -0.638795681624 , 0.467053715637 , 0.308126560401 );
    
    // Initialize the other variables:
    fragCoord = pFragCoord;
    
	adjusted_time = iTime * time_scale;
    //adjusted_time = 1.2;	// Static value for debugging purposes.
    
	adjusted_time_for_sun = mod(adjusted_time, 3.1415926535897932384626433832795);

	light_direction = normalize(vec3(cos(adjusted_time_for_sun) * 2.0, sin(adjusted_time_for_sun) * 2.0, 1.5));
	light_exponent = 2.0;

	is_day = step(0.0, sin(adjusted_time));
	
	
		
	//noon_night_factor = sin(adjusted_time) * 0.5 + 0.5;	// 1.0 = noon, 0.0 = night
	
	noon_evening_factor = max(sin(adjusted_time), 0.0);	// 1.0 = noon, 0.0 = evening
	noon_night_factor = noon_evening_factor * noon_evening_factor;	// 1.0 = noon, 0.0 = night

	light_color = mix(light_color_night, mix(light_color_evening, light_color_noon, noon_evening_factor), noon_night_factor);
	sky_color = mix(sky_color_night, mix(sky_color_evening, sky_color_noon, noon_evening_factor), noon_night_factor);

	// Turn the sun into a moon:
	light_color = mix(moon_color, light_color, is_day);
	//sky_color = mix(moon_color, sky_color, is_day);
    
    // This is used to darken the light at sunset and sunrise to
    // make the transition between sun and moon less obvious.
    //const float threshold = 0.2;
    float light_brightness = pow(abs(sin(adjusted_time_for_sun)), 0.5);
    
	//sky_color *= light_brightness;
	light_color *= light_brightness;
}



//vec3 light_color = mix(light_color_evening, light_color_day, light_color_blend_factor);



mat3 construct_around_vector(vec3 vector)
{
	vec3 smallest_component_vector;

	if((abs(vector.x) < abs(vector.y))&&(abs(vector.x) < abs(vector.z)))	// TODO: PERFORMANCE: The "abs()" calls could be pretty slow! Use squared values instead? Or do two checks per value?
	{
		smallest_component_vector = vec3(1.0, 0.0, 0.0);
	}
	else if(abs(vector.y) < abs(vector.z))
	{
		smallest_component_vector = vec3(0.0, 1.0, 0.0);
	}
	else
	{
		smallest_component_vector = vec3(0.0, 0.0, 1.0);
	}

	// TODO: PERFORMANCE: Is this a way to avoid computing two cross products? http://stackoverflow.com/questions/19337314/generate-random-point-on-a-2d-disk-in-3d-space-given-normal-vector
	// TODO: PERFORMANCE: The cross product with "smallest_component_vector" can be simplified, because two components are always zero.

	vec3 vector_x = normalize(cross(vector, smallest_component_vector));	// We must to normalize the result here, because the two vectors are not orthogonal.
	vec3 vector_z = cross(vector_x, vector);	// The two vectors are orthogonal unit vectors, that's why no normalization is required.

	return(mat3(vector_x, vector, vector_z));
}


vec3 to_linear_space(vec3 color)
{
	return(pow(color, vec3(gamma)));  
}

vec3 to_gamma_space(vec3 color)
{
	return(pow(color, vec3(1.0 / gamma)));
}

float hash(vec2 P)
{
	// gridcell is assumed to be an integer coordinate
	
	//const vec2 OFFSET = vec2(16.0, 19.0);
	
	//const vec2 OFFSET = vec2(166.0, 19.0);
	//const float DOMAIN = 4.0;
	
	const vec2 OFFSET = vec2(131.0, 149.0);
	const float DOMAIN = 16.0;
	
	/*
	const vec2 OFFSET = vec2(124.0, 326.0);
	const float DOMAIN = 8.0;
	*/
	const float DOMAIN_SQUARED = DOMAIN * DOMAIN;
	const float SOMELARGEFLOAT = 1.0 / 951.135664;

	P = mod(P, DOMAIN);	// truncate the domain (same as the above)
	P += OFFSET.xy;	// offset to interesting part of the noise
	P *= P;	// calculate and return the hash
	
	return(fract(P.x * P.y * SOMELARGEFLOAT));
}


float mod289(float x)
{
	return(x - floor(x * (1.0 / 289.0)) * 289.0);
}

vec4 mod289(vec4 x)
{
	return(x - floor(x * (1.0 / 289.0)) * 289.0);
}

vec4 perm(vec4 x)
{
	return(mod289(((x * 34.0) + 1.0) * x));
}

float noise_3d(vec3 p)
{
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return(o4.y * d.y + o4.x * (1.0 - d.y));
}

float noise(vec3 p)
{
    p.y = 0.0;
    
    return(noise_3d(p));
}

float detailed_noise_flat(vec2 p)
{
	//return(noise(p));
    p *= 0.3;
	
	vec3 p3 = vec3(p.x, 0.0, p.y);
    
	/*
	float n = (//noise(p3) +
			0.5 * noise(p3 * 2.0) +
			0.25 * noise(p3 * 4.0) +
			0.125 * noise(p3 * 8.0) +
			0.0625 * noise(p3 * 16.0) +
			0.03125 * noise(p3 * 32.0)
			//+ 0.015625 * noise(p3 * 64.0)
    		);
    
    */
    /*
	float n = (//noise(p3) +
       		//-0.8 * noise(p3 * 0.5) + 	// Large scale variation.
			0.2 * pow(1.0 + noise(p3 * 2.0), 1.5) +
			0.1 * pow(1.0 + noise(p3 * 4.0), 1.5) +
			0.125 * noise(p3 * 8.0) +
			0.0625 * noise(p3 * 16.0) +
			0.03125 * noise(p3 * 32.0)
			//+ 0.015625 * noise(p3 * 64.0)
    		);
    */
    
    float val1 = noise(p3 * 1.0);
        
	float n = (
       		 -0.2 * noise(p3 * 0.25) + 	// Large scale variation.
			0.5 * pow(noise(p3 * 1.0), 2.0) +
			+ 0.5 * pow(noise(p3 * 0.5 + 0.25), 2.0)+
			0.25 * noise(p3 * 4.0) +
			0.125 * noise(p3 * 8.0)*val1 +
			0.0625 * noise(p3 * 16.0)* (1.0 - val1) +
			0.03125 * noise(p3 * 32.0) * (1.0 - val1) +
			0.015 * noise(p3 * 64.0) * pow(1.0 - val1, 1.5)	/// Only add this to the lower layers.
    		);
    
    
    return(n);
}

float detailed_noise_3d(vec3 p)
{
    p *= 0.3;
    
    float val1 = noise_3d(p);
        
	float n = (
       		 -0.2 * noise_3d(p * 0.25) + 	// Large scale variation.
			0.5 * pow(noise_3d(p * 1.0), 2.0) +
			+ 0.5 * pow(noise_3d(p * 0.5 + 0.25), 2.0)+
			0.25 * noise_3d(p * 4.0) +
			0.125 * noise_3d(p * 8.0)*val1 +
			0.0625 * noise_3d(p * 16.0)* (1.0 - val1) +
			0.03125 * noise_3d(p * 32.0) * (1.0 - val1) +
			0.015 * noise_3d(p * 64.0) * pow(1.0 - val1, 1.5)	/// Only add this to the lower layers.
    		);
    
    
    return(n);
}

float detailed_noise(vec3 p)
{
	return(detailed_noise_flat(p.xz));
}

float camera_noise(vec3 p)
{
	//return(noise(p));
    p *= 0.3;
    
	
	float n = (
			0.5 * noise(p * 2.0) +
			0.25 * noise(p * 4.0) +
			0.125 * noise(p * 8.0)
    		);
    
    return(n);
}
/*
float noise1(vec3 p)
{
	//return(noise(p));
    p *= 0.01;
    
	
	float n = 0.5 * noise(p * 2.0);
    
    return(n * n * n * n * 4.0);
}
*/
float calculate_shadow(vec3 start_position, vec3 light_direction, float max_distance)
{
    const float step_size = 0.15;
    light_direction *= step_size;
    
    float occlusion_factor = 1.0;
    float travelled_distance = 0.0;
	const float k = 4.0;	// Higher value = harder shadows
    
    for(int i=0; i<32; ++i)
    {
		start_position += light_direction;
        travelled_distance += step_size;
		
        float sample_height = detailed_noise_flat(start_position.xz) * terrain_height_multiplicator;
        
        float distance_to_surface = start_position.y - sample_height;	// This is just an approximation!

		occlusion_factor = min(occlusion_factor, k * distance_to_surface / travelled_distance);
        
        // Early exit:
        if(distance_to_surface < 0.0)
        {
        	break;   
        }
    }
    
    return(max(occlusion_factor, 0.0));
}

vec3 generate_random_coordinate_in_hemisphere(float random1, float random2, float random3)
{
	// TODO: Use my approach from the path tracer instead?
	
    float phi = 6.283185307179586476925286766559 * random1;
	float costheta = random2;
	float theta = acos(costheta);
	
	vec3 p;
	
	p.x = sin(theta) * cos(phi);
	p.y = sin(theta) * sin(phi);
	p.z = cos(theta);

	p.y = abs(p.y);	// Mirror along Y so we sample a hemisphere instead of a sphere.

	float r = pow(random3, 1.0 / 3.0);
	
	p *= r;
        
    return(p);
}


vec3 get_next_on_sphere2(float random1, float random2, float random3)
{
    float phi = 6.283185307179586476925286766559 * random1;
	float costheta = random2;
	float theta = acos(costheta);
	
	vec3 p;
	p.x = sin(theta) * cos(phi);
	p.y = sin(theta) * sin(phi);
	p.z = cos(theta);

	float r = pow(random3, 1.0 / 3.0);
	
	p *= r;
        
    return(p);
}
	
vec3 get_next_on_sphere(float random1, float random2)
{
    vec3 vector;

    vector.z = random1 * 2.0 - 1.0;
    float theta = random2 * 6.283185307179586476925286766559;
    float temp = sqrt(1.0 - vector.z * vector.z);

    vector.x = temp * cos(theta);
    vector.y = temp * sin(theta);

    //return(normalize(vector));	// TODO: PERFORMANCE: Does this vector need to be normalized?
    return(vector);	// TODO: PERFORMANCE: Does this vector need to be normalized?
}

vec3 generate_random_coordinate_in_hemisphere2(vec3 normal, float random1, float random2, float random3)
{
    //vec3 vector = get_next_on_sphere(random1, random2);
    vec3 vector = get_next_on_sphere2(random1, random2, random3);
    
    //vector.y = abs(vector.y);
    
   // vector *= pow(random3, 1.0 / 3.0)
        
    float sign_multiplicator = 1.0 - 2.0 * step(dot(normal, vector), 0.0);	// Compute the sign of the dot product (without branching). Results in either "-1.0f" or "1.0f".
    
    // TODO: Theoretically this needs a fourth random number!
    sign_multiplicator *= pow(random3, 1.0 / 3.0);	// This makes the distribution uniform inside the hemisphere.
    
    vector *= sign_multiplicator;	// Flip the sign if neccessary, so we sample the hemisphere instead.
   
            
    return(vector);
}


vec3 calculate_colored_ambient_occlusion3(vec3 start_position, vec3 normal, float max_distance,
                                          vec3 light_direction, vec3 light_color, vec3 sky_color)
{
    const float radius = 1.5;
    const float step_size = 0.1;
   
	
    float random = hash(fragCoord.xy);
    
    /*
    // Add a random offset per pixel, so the AO banding disappears.
    vec3 hash_coordinate = floor(start_position * 1024.0);
    start_position.x += (hash(hash_coordinate.yx) - 0.5) * radius * 0.5;
    start_position.y += (hash(hash_coordinate.xz) - 0.5) * radius * 0.5;
    start_position.z += (hash(hash_coordinate.zy) - 0.5) * radius * 0.5;
    */
    
    // TODO: We could take the sky color and light direction into account to calculate colored AO.
    

        
    //float center_height = detailed_noise_flat(start_position.xz);
    
	vec3 occlusion_sum = vec3(0.0);
	float sample_count = 0.0;
    
	
    /*
    for(int x=-radius; x<=radius; ++x)
    for(int y=0; y<=radius; ++y)
    for(int z=-radius; z<=radius; ++z)
        */
    
    vec3 unoccluded_direction = vec3(0.0);
    
    //const int samples = 5;
    
    float blend_factor_sum = 0.0;
    float sky_visibility = 0.0;
    float horizon_occlusion_sum = 0.0;
    
    float smallest_horizon = 9999.9;
    
    //const int samples = coordinate_count;
    const int samples = 1;
    
    for(int x=-samples; x<=samples; ++x)
    for(int z=-samples; z<=samples; ++z)
    {
        if((z == 0)&&(x == 0))
        {
            continue;
        }
        
      	// TODO: Exclude center sample!
        
        float normalized_hash_offset = float(x) / float(samples);
        float random1 = fract(random + (normalized_hash_offset + 0.1415926535897932384626433832795) * 7.0);
        float random2 = fract(random + (normalized_hash_offset + 0.1415926535897932384626433832795) * 13.0);
        float random3 = fract(random + (normalized_hash_offset + 0.7692307692307692307692307692308) * 19.0);
        
        //random1 = random2 = random3;
        
        
        vec3 sample_offset = vec3(float(x) * step_size, 0.0, float(z) * step_size);
        
        
        
        float angle = random * 1.5707963267948966192313216916398;	// Rotate only by 180Â° because that's enough since we're sampling using a symmetric.
        float cs = cos(angle);
        float sn = sin(angle);
        
        float rotated_x = sample_offset.x * cs - sample_offset.z * sn; // now x is something different than original vector x
		float rotated_z = sample_offset.x * sn + sample_offset.z * cs;
        
        sample_offset.x = rotated_x;
        sample_offset.z = rotated_z;
        
        
        
        
        
        vec3 sample_coordinate = start_position + sample_offset;
        sample_coordinate.y = detailed_noise_flat(sample_coordinate.xz) * terrain_height_multiplicator;
        
        vec3 sample_coordinate2 = start_position - sample_offset;
        sample_coordinate2.y = detailed_noise_flat(sample_coordinate2.xz) * terrain_height_multiplicator;
        
        
        
        vec3 center_to_sample = sample_coordinate - start_position;
        
        vec3 n_center_to_sample = normalize(center_to_sample);
        float cosine = dot(n_center_to_sample, normal);	// max() not required since we're sampling a hemisphere.
        
        float color_blend_factor = max(dot(n_center_to_sample, light_direction), 0.0);
        color_blend_factor = pow(color_blend_factor, light_exponent);
        
        vec3 sample_color = mix(sky_color, light_color, color_blend_factor);
                
        float sample_weight = cosine;
        sample_weight = 1.0;
        
        float squared_radius = radius * radius;
		float squared_distance = dot(center_to_sample, center_to_sample);
        sample_weight = max(0.0, 1.0 - squared_distance / squared_radius);	// Falloff to zero towards "radius".
        
        sample_weight *= cosine;	// max() not required since we're sampling a hemisphere.
        
        sample_weight = 1.0;
        
        // Crytek's method:
        float sample_unoccluded = step(sample_coordinate.y, start_position.y);	// 1.0 if unoccluded, 0.0 if occluded.
       	vec3 sample_occlusion = sample_color * sample_unoccluded;
        
        
        sample_weight = sample_unoccluded;
        unoccluded_direction += n_center_to_sample * sample_weight;
        

        
        color_blend_factor *= sample_unoccluded;	// No sun in occluded areas!
        
        
        blend_factor_sum += color_blend_factor * sample_weight;
        sky_visibility += sample_unoccluded * sample_weight;
        
        
		occlusion_sum += sample_color * sample_unoccluded * sample_weight;
		//occlusion_sum += sample_occlusion * sample_weight;
		
        
        
        ////////////////////////////////////////////
        sample_weight = 1.0;
        //sample_weight = sample_unoccluded;
        
        //vec3 n_center_to_sample = normalize(center_to_sample);
        vec3 center_to_sample2 = sample_coordinate2 - start_position;
        vec3 n_center_to_sample2 = normalize(center_to_sample2);
        
        float horizon = dot(n_center_to_sample, n_center_to_sample2) * 0.5 + 0.5;
        horizon = max(dot(n_center_to_sample, -n_center_to_sample2), 0.0);
        
        horizon_occlusion_sum += horizon;
        
        smallest_horizon = min(smallest_horizon, horizon);
        ////////////////////////////////////////////
        
        
        
        sample_count += sample_weight;
    }
	
    horizon_occlusion_sum /= sample_count;
    
	occlusion_sum /= sample_count;
	sky_visibility /= sample_count;
    blend_factor_sum /= sample_count;
    
    
    //return(vec3(smallest_horizon));
    return(vec3(horizon_occlusion_sum));
    
   
    unoccluded_direction = normalize(unoccluded_direction / sample_count);
    
    return(vec3(max(dot(unoccluded_direction, -light_direction), 0.0)));
    
    //return(vec3(max(dot(unoccluded_direction, normal), 0.0)));
    return(unoccluded_direction * 0.5 + vec3(0.5));
    
    /*
    float color_blend_factor = max(dot(unoccluded_direction, light_direction), 0.0);
    color_blend_factor = pow(color_blend_factor, light_exponent);
    vec3 sample_color = mix(sky_color, light_color, color_blend_factor);

    occlusion_sum = sample_color;
    */
    
    //occlusion_sum = normal * 0.5 + vec3(0.5);
    //occlusion_sum = vec3(normal.y);
    
   	//blend_factor_sum = pow(blend_factor_sum, light_exponent);
    
    //return(occlusion_sum);
    
    
    return(vec3(sky_visibility));
    //return(vec3(blend_factor_sum));
    
    vec3 indirect_light = mix(sky_color, light_color, blend_factor_sum);	// Calculate light color
   	indirect_light *= sky_visibility;	// Add sky occlusion
    
    return(indirect_light);
    
    
    return(vec3(occlusion_sum));
}

vec3 calculate_colored_ambient_occlusion(vec3 start_position, vec3 normal, float max_distance,
                                          vec3 light_direction, vec3 light_color, vec3 sky_color)
{
    const float radius = 1.5;
    
	mat3 normal_matrix = construct_around_vector(normal);
	
	mat4 hemisphere_matrix = mat4(vec4(normal_matrix[0], 0.0),
                                  vec4(normal_matrix[1], 0.0),
                                  vec4(normal_matrix[2], 0.0),
                                  vec4(start_position, 1.0));
    // TODO: Improve this randomization!
	
    float random = hash(fragCoord.xy);
    float random1 = random;
    float random2 = hash(fragCoord.xy * 16.0 + 16.0);
    float random3 = hash(fragCoord.xy * 32.0 + 32.0);
    
    /*
    // Add a random offset per pixel, so the AO banding disappears.
    vec3 hash_coordinate = floor(start_position * 1024.0);
    start_position.x += (hash(hash_coordinate.yx) - 0.5) * radius * 0.5;
    start_position.y += (hash(hash_coordinate.xz) - 0.5) * radius * 0.5;
    start_position.z += (hash(hash_coordinate.zy) - 0.5) * radius * 0.5;
    */
    
    // TODO: We could take the sky color and light direction into account to calculate colored AO.
    

        
    //float center_height = detailed_noise_flat(start_position.xz);
    
	vec3 occlusion_sum = vec3(0.0);
	float sample_count = 0.0;
    
	
    /*
    for(int x=-radius; x<=radius; ++x)
    for(int y=0; y<=radius; ++y)
    for(int z=-radius; z<=radius; ++z)
        */
    
    vec3 unoccluded_direction = vec3(0.0);
    
    //const int samples = 5;
    
    float blend_factor_sum = 0.0;
    float sky_visibility = 0.0;
    
    //const int samples = coordinate_count;
    const int samples = 16;
    for(int i=0; i<samples; ++i)
    {
        /*
        float x = 1.0 - 2.0 / float(samples) * float(i);
        float y = mod(1.0 - 2.0 / float(samples) * float(i * 2), 1.0);
        float z = mod(1.0 - 2.0 / float(samples) * float(i * 4), 1.0);
        */
        
       
        /*
        const float pi = 3.1415926535897932384626433832795;
        const float _2pi = 6.283185307179586476925286766559;
        
        float factor = 1.0 / float(samples) * float(i);
        
        vec3 random_coordinate;
        random_coordinate.x = sin((random1 + factor) * _2pi);
        random_coordinate.y = abs(sin((random2 + factor) * _2pi));
        random_coordinate.z = cos((random1 + factor) * _2pi);
        
        random_coordinate *= random3 * radius;
        
		vec3 sample_coordinate = (hemisphere_matrix * vec4(random_coordinate, 1.0)).xyz;
        */
        
        
        /*
        vec3 random_coordinate = coordinates[i];
        
        
        float angle = random1 * 6.283185307179586476925286766559 + float(i) * float(samples);
        float cs = cos(angle);
        float sn = sin(angle);
        
        float x = random_coordinate.x * cs - random_coordinate.z * sn; // now x is something different than original vector x
		float z = random_coordinate.x * sn + random_coordinate.z * cs;
        
        random_coordinate.x = x;
        random_coordinate.z = z;

        random_coordinate *= radius;
       
		vec3 sample_coordinate = (hemisphere_matrix * vec4(random_coordinate, 1.0)).xyz;
        */
        
        
        /*
        float hash_offset = float(i);
        float normalized_hash_offset = float(i) / float(samples);
        float random1 = hash(fragCoord.xy + hash_offset * 3.0);
        float random2 = hash(fragCoord.xy * 7.0 + hash_offset * 13.0);
        float random3 = hash(fragCoord.xy * 13.0 + hash_offset * 21.0);
        
        random1 = fract(random1 + normalized_hash_offset);
        random2 = fract(random2 + normalized_hash_offset);
        random3 = fract(random3 + normalized_hash_offset);
        */
        
        float normalized_hash_offset = float(i) / float(samples);
        float random1 = fract(random + (normalized_hash_offset + 0.1415926535897932384626433832795) * 7.0);
        float random2 = fract(random + (normalized_hash_offset + 0.1415926535897932384626433832795) * 13.0);
        float random3 = fract(random + (normalized_hash_offset + 0.7692307692307692307692307692308) * 19.0);
        
        //random1 = random2 = random3;
        
        vec3 sample_coordinate = start_position + generate_random_coordinate_in_hemisphere2(normal, random1, random2, random3) * radius;
        
        
        
        
        float sample_height = detailed_noise_flat(sample_coordinate.xz) * terrain_height_multiplicator;
        
        //vec3 sample_position = vec3(sample_coordinate.x, sample_height, sample_coordinate.z);
      
        //float color_blend_factor = dot(normal, light_direction) * 0.5 + 0.5;
        
        //float color_blend_factor = max(dot(normal, light_direction), 0.0);
        
        vec3 center_to_sample = sample_coordinate - start_position;
        
        vec3 random_direction = normalize(center_to_sample);
        float cosine = dot(random_direction, normal);	// max() not required since we're sampling a hemisphere.
        
        float color_blend_factor = max(dot(random_direction, light_direction), 0.0);
        color_blend_factor = pow(color_blend_factor, light_exponent);
        
        vec3 sample_color = mix(sky_color, light_color, color_blend_factor);
                
        float sample_weight = cosine;
        sample_weight = 1.0;
        
        float squared_radius = radius * radius;
		float squared_distance = dot(center_to_sample, center_to_sample);
        sample_weight = max(0.0, 1.0 - squared_distance / squared_radius);	// Falloff to zero towards "radius".
        
        sample_weight *= cosine;	// max() not required since we're sampling a hemisphere.
        
        // Crytek's method:
        float sample_unoccluded = step(sample_height, sample_coordinate.y);	// 1.0 if unoccluded, 0.0 if occluded.
       	vec3 sample_occlusion = sample_color * sample_unoccluded;
        
        /*
        sample_weight = sample_unoccluded;
        unoccluded_direction += random_direction * sample_unoccluded;
        */

        
        color_blend_factor *= sample_unoccluded;	// No sun in occluded areas!
        
        
        blend_factor_sum += color_blend_factor * sample_weight;
        sky_visibility += sample_unoccluded * sample_weight;
        
        
		occlusion_sum += sample_color * sample_unoccluded * sample_weight;
		//occlusion_sum += sample_occlusion * sample_weight;
		sample_count += sample_weight;
    }
	
	occlusion_sum /= sample_count;
	sky_visibility /= sample_count;
    blend_factor_sum /= sample_count;
    
    
    /*
    unoccluded_direction = normalize(unoccluded_direction / sample_count);
    
    float color_blend_factor = max(dot(unoccluded_direction, light_direction), 0.0);
    color_blend_factor = pow(color_blend_factor, light_exponent);
    vec3 sample_color = mix(sky_color, light_color, color_blend_factor);

    occlusion_sum = sample_color;
    */
    
    //occlusion_sum = normal * 0.5 + vec3(0.5);
    //occlusion_sum = vec3(normal.y);
    
   	//blend_factor_sum = pow(blend_factor_sum, light_exponent);
    
    //return(occlusion_sum);
    
    
    //return(vec3(occlusion_sum2));
    //return(vec3(blend_factor_sum));
    
    vec3 indirect_light = mix(sky_color, light_color, blend_factor_sum);	// Calculate light color
   	indirect_light *= sky_visibility;	// Add sky occlusion
    
    return(indirect_light);
    
    
    return(vec3(occlusion_sum));
}

vec3 calculate_normal(vec3 p_center, float step_size)
{
    step_size *= 0.2;

    p_center.y = detailed_noise_flat(p_center.xz) * terrain_height_multiplicator;

    vec3 p_x = p_center + vec3(step_size, 0.0, 0.0);
    p_x.y = detailed_noise_flat(p_x.xz) * terrain_height_multiplicator;

    vec3 p_z = p_center + vec3(0.0, 0.0, step_size);
    p_z.y = detailed_noise_flat(p_z.xz) * terrain_height_multiplicator;

    vec3 normal = cross(p_center - p_z,
                        p_center - p_x);
    
    return(normalize(normal));
}

vec3 shade_pixel(vec3 intersection_point, vec3 ray_direction, float step_size)
{
    //vec3 normal = calculate_normal(intersection_point, step_size);
    
    vec3 normal;
    if(intersection_point.y < water_height)	// If water was hit:	// TODO: Integrate this into the height function!
    {
        // TODO: Calculate correct intersection point!
    	intersection_point.y = water_height - step_size * 0.05;
        
    	normal = vec3(0.0, 1.0, 0.0);
        // TODO: Calculate proper water normal!
        // TODO: We could actually just trace from the eye to the water instead.
        
        // TODO: Move the noise based on time and on the Y axis.
        vec3 noise_sample_position;
        noise_sample_position.x = intersection_point.x * 250.0 + adjusted_time * 50.0;
        noise_sample_position.y = adjusted_time * 50.0;
        noise_sample_position.z = intersection_point.z * 250.0 + adjusted_time * 50.0;
        
        vec3 normal_offset;
        normal_offset.x = detailed_noise_3d(noise_sample_position) - 0.5;
        normal_offset.z = detailed_noise_3d(noise_sample_position + vec3(0.0, 13.0, 0.0)) - 0.5;
        normal_offset.xz *= 0.05;
        
        //normal_offset.y = max(1.0 - dot(normal_offset.xz, normal_offset.xz), 0.0);
        normal_offset.y = 0.5;
        
        normal = normalize(normal_offset);
    }
    else
    {
    	normal = calculate_normal(intersection_point, step_size);
    }
    
 	float noise_for_rock_color = detailed_noise(intersection_point * 36.0 + vec3(10.0));
    float noise_for_grass_color = detailed_noise(intersection_point * 40.0 + vec3(10.0));

    float noise_for_rock = detailed_noise(intersection_point * 5.0 + vec3(40.0));
    float noise_for_snow = detailed_noise(intersection_point * 10.0 + vec3(20.0));

    vec3 grass_color = vec3(0.6 * intersection_point.y * 0.4, 0.5 * intersection_point.y * 0.4 + 0.15, 0.1);
    grass_color = mix(grass_color * 0.7,
                      grass_color,
                      smoothstep(0.2, 0.9, noise_for_grass_color * intersection_point.y));

    vec3 rock_color = vec3(0.55, 0.55, 0.5) * 0.7;
    vec3 rock_color2 = vec3(0.55, 0.52, 0.45) * 0.85;
    rock_color = mix(rock_color,
                     rock_color2,
                     smoothstep(0.3, 0.7, noise_for_rock_color * intersection_point.y * 0.5));


    vec3 albedo = mix(grass_color,	// Grass
                      rock_color,	// Rock
                      min(max(intersection_point.y * 0.28 - 0.35 + (noise_for_rock * 0.4 - 0.2), 0.0) * 15.0, 1.0));

    float snow_strength = min(max(intersection_point.y * 0.3 - 0.5 + (noise_for_snow * 0.4 - 0.2), 0.0) * 20.0, 1.0);
    
    //snow_strength -= pow(max(dot(normal, vec3(0.0, -1.0, 0.0)) * 0.5 + 0.5, 0.0), 8.0) * 200.0;	// Surfaces that don't point up shouldn't get snow.
    snow_strength *= smoothstep(0.35, 0.45, max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0));	// Surfaces that don't point up don't get snow.
    
    snow_strength = clamp(snow_strength, 0.0, 1.0);
    
    albedo = mix(albedo,
                 vec3(0.75, 0.95, 1.0),	// Snow
                 snow_strength);


   


    float lambert = max(dot(normal, light_direction), 0.0);


    vec3 ambient = calculate_colored_ambient_occlusion(intersection_point, normal, 1.0,
                                                       light_direction, light_color, sky_color);
   

    float direct_occlusion = calculate_shadow(intersection_point, light_direction, 10.0);
    lambert *= direct_occlusion;

    vec3 half_vector = normalize(-ray_direction + light_direction);

    float specular_exponent = 16.0;
    float specular_mask = direct_occlusion * 4.0;
    
    if(intersection_point.y < water_height)	// If water was hit:	// TODO: Integrate this into the height function!
    {
        lambert = max(lambert - 0.75, 0.0) * 4.0;
        specular_exponent = 640.0;
        albedo = mix(vec3(0.1, 0.8, 1.0), albedo, 0.25);
        
        const float shore_threshold = 0.125;
        
        float adjusted_water_height = water_height;
        adjusted_water_height += sin(detailed_noise_flat(intersection_point.xz * 16.0 + vec2(adjusted_time * 16.0, adjusted_time * 8.0)) * 3.142) * shore_threshold * 0.5;
        
        
        float water_surface_to_ground_distance = adjusted_water_height - detailed_noise_flat(intersection_point.xz) * terrain_height_multiplicator;
        
       
        float shore_factor = 1.0 - smoothstep(0.0, shore_threshold, water_surface_to_ground_distance);
        albedo = mix(albedo, vec3(1.0), shore_factor);
    }
    else
    {
        specular_mask *= snow_strength;
    }
    
    float specular = pow(max(dot(half_vector, normal), 0.0), specular_exponent);
    specular *= specular_mask;

    vec3 result = albedo * (light_color * lambert + ambient);

    //fragColor.rgb += to_linear_space(light_color * specular);
    result += light_color * specular;
    

    //fragColor.rgb = vec3(direct_occlusion);
    //fragColor.rgb = vec3(specular);
    //fragColor.rgb = vec3(normal.x);


    //result = ambient;

    //fragColor.rgb = vec3(normal.x);
    //fragColor.rgb = vec3(normal.x);
    //fragColor.rgb = vec3(normal.z);



    /*
    fragColor = mix(vec4(0.1, 0.3, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    fragColor.y);
    */
    
    //return(vec3(lambert));
    return(result);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{    
	initialize_global_variables(fragCoord);
	
	vec2 uv = fragCoord.xy / iResolution.xy;
    
	//fragColor = vec4(detailed_noise(vec3(uv * 10.0, 0.0)));
	fragColor.rgb = sky_color;
    
	//vec3 eye_offset = vec3(10.0, 6.0, sin(iTime * 0.1) * 10.0);
	//vec3 eye_offset = vec3(5.0, 3.0, 0.0);
	vec3 eye_offset = vec3(5.0, 6.0, 0.0);
    
    float angle = iTime * 0.03;
    vec3 look_direction_on_ground = vec3(sin(angle), 0.0, cos(angle));
    vec3 look_direction_on_ground_perpendicular = vec3(-look_direction_on_ground.z, 0.0, look_direction_on_ground.x);
    //vec3 up_vector = cross(look_direction_on_ground, look_direction_on_ground_perpendicular);
    vec3 up_vector = vec3(0.0, 1.0, 0.0);
    
    
    mat3 rotation_matrix = mat3(look_direction_on_ground_perpendicular,
                                up_vector,
                                look_direction_on_ground);
    
    
    //eye_offset.xz = vec2(-cos(angle), sin(angle)) * 4.0;	// Go around in circle.
    eye_offset.xz = vec2(cos(angle), sin(angle)) * 10.0;	// Rotate around weirdly.

    //eye_offset += vec3(0.0, camera_noise(vec3(eye_offset.x, 0.0, eye_offset.z)), 0.0);
    
    
    vec3 eye_position = eye_offset;
   
    vec3 ray_start = eye_position;
	/*
	vec3 look_direction = vec3(0.0, -1.25, 0.0);
    vec3 ray_direction = normalize(vec3(uv * 2.0 - vec2(1.0), 1.0) + look_direction);
    */
    vec3 look_direction = rotation_matrix * vec3(vec3(uv * 2.0 - vec2(1.0), 1.0));
    look_direction.y -= 0.95;
    vec3 ray_direction = normalize(look_direction);
   
    
    const int raymarch_samples = 64;
    const int inverse_raymarch_samples = 10;
    
    const float step_size = max_view_distance / float(raymarch_samples);
        
    vec3 ray_increment = ray_direction * step_size;
    vec3 inverse_ray_increment = -ray_increment / float(inverse_raymarch_samples);
    
    // Add a random offset to fight precision issues (dithering):
    //ray_start += ray_increment * hash(fragCoord.xy);
    
    float terrain_height;
    vec3 intersection_point = vec3(9999.9);
    
    float accumulated_cloud_density = 0.0;
    
    for(int i=0; i<raymarch_samples; ++i)
    {
		ray_start += ray_increment;
                
        // TODO: Randomize colors by applying the noise function!

        /*
        float cloud_density = max((noise_3d(ray_start * 1.1) - 0.25) * 1.33333, 0.0);	// Large scale to vary where clouds are.
        cloud_density *= noise_3d(ray_start * 2.0);	// Rough cloud shape.
        cloud_density *= noise_3d(ray_start * 5.0);	// Detailed cloud shape.
        
        
        float eye_to_sample_distance = distance(eye_position, ray_start);
        float blend_factor = eye_to_sample_distance / max_view_distance;
        blend_factor = pow(blend_factor, fog_exponent);
		cloud_density *= 1.0 - blend_factor;
        
        accumulated_cloud_density += cloud_density * 0.15;
        */

		
        terrain_height = detailed_noise_flat(ray_start.xz) * terrain_height_multiplicator;
        		
       	// float sample_height = noise1(ray_start);
		if(ray_start.y < terrain_height)
		{
            // Step backwards and out of the surface:
            for(int j=0; j<inverse_raymarch_samples; ++j)
            {
				ray_start += inverse_ray_increment;
                
				terrain_height = detailed_noise_flat(ray_start.xz) * terrain_height_multiplicator;
				
                if(ray_start.y >= terrain_height)
                {
                	break;   
                }
            }
            
       		intersection_point = vec3(ray_start.x, terrain_height, ray_start.z);

			break;
		}
    }
    
    if(intersection_point.x < 9000.0)	// This avoids calling "shade_pixel()" for sky pixels.
    {
        fragColor.rgb = shade_pixel(intersection_point, ray_direction, step_size);
    }

    // Now add some fog:    
    float eye_to_sample_distance = distance(eye_position, ray_start);
    
    //float blend_factor = min(eye_to_sample_distance * fog_strength, 1.0);
    float blend_factor = eye_to_sample_distance / max_view_distance;
    blend_factor = pow(blend_factor, fog_exponent);
    fragColor.rgb = mix(fragColor.rgb, sky_color, blend_factor);
                        
    // TODO: Properly blend sun color with sky!
    
    // Add some sun to the fog:
    float sun_brightness = dot(light_direction, ray_direction) * 0.5 + 0.5;
    fragColor.rgb += light_color * pow(sun_brightness, light_exponent);
   
    /*
    // Add clouds:
    accumulated_cloud_density = pow(accumulated_cloud_density, 2.0);
    //fragColor.rgb = mix(vec3(1.0), fragColor.rgb, 1.0 / (1.0 + accumulated_cloud_density));
    
    float cloud_blend_factor = min(accumulated_cloud_density * 10.0, 1.0) * (1.0 - blend_factor);
    vec3 cloud_color = mix(vec3(1.0), sky_color, blend_factor);
    fragColor.rgb = mix(fragColor.rgb, cloud_color, cloud_blend_factor);
    */
    
    // Crappy tonemapping to make it look more realistic:
    //fragColor.rgb = pow(fragColor.rgb, vec3(1.0 + fragColor.rgb));
    
    //fragColor.rgb = vec3(accumulated_cloud_density);
    
    // TODO: How does shadertoy treat gamma?
    //fragColor.rgb = to_gamma_space(fragColor.rgb);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}