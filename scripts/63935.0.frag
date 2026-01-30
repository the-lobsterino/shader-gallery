/*
 * Original shader from: https://www.shadertoy.com/view/MdtyRN
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
#define PI 3.141592653589
const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;
const vec3 GREEN = vec3(170.0/255.0, 217.0/255.0,197.0/255.0);
const vec3 PINK = vec3(231.0/255.0, 81.0/255.0, 129.0/255.0);
const vec3 PURPLE = vec3(81.0/255.0,66.0/255.0, 95.0/255.0);

/**
 * Rotation matrix around the Y axis.
 */
mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

/**
 * Rotation matrix around the Z axis.
 */
mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sceneSDF(vec3 samplePoint, float theta, float thetaZ) {
    mat3 rotate = rotateY(radians(theta));
    mat3 rotateZ = rotateZ(radians(thetaZ));
    return sdBox(rotateZ * rotate * samplePoint, vec3(0.55));
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start,
                                float end, float theta, float thetaZ) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec3 samplePt = vec3(eye + depth * marchingDirection);
        float dist = sceneSDF(samplePt, theta, thetaZ);
        if (dist < EPSILON) {
			return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}


// theta is rotation around Y, z is rotation around z
vec3 estimateNormal(vec3 p, float theta, float z) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z), theta, z) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z), theta, z),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z), theta, z) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z), theta, z),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON), theta, z) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON), theta, z)
    ));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    float aspect = iResolution.x/iResolution.y;
    
    // Transform to NDC
    vec2 srcPt = uv * 2.0 - 1.0; 
    float sx = srcPt.x;
	float sy = srcPt.y;
    srcPt.x *= aspect;
    
    ////////////////////// Camera stuff
    // camera position
	vec3 c_pos = vec3(8.0, 8.0, 8.0);
    // camera target
    vec3 c_targ = vec3(0.0, 0.0, 0.0);
    // camera direction
    vec3 c_dir = normalize(c_targ - c_pos);
    // camera right
    vec3 c_right = vec3(1.0,0.0,-1.0);
    // camera up
    vec3 c_up = cross( c_right, c_dir);
    
    // compute the ray direction
    vec3 r_dir = normalize(c_dir);

    // THE CAMERA EYE
    vec3 eye = c_pos + c_right * sx * aspect + c_up * sy;
        
    mat2 rot1;
    float theta = - PI / 6.0;

    float cosTheta, sinTheta;
    cosTheta = cos(theta);
    sinTheta = sin(theta);
    rot1[0][0] = cosTheta;
    rot1[0][1] = -sinTheta;
    rot1[1][0] = sinTheta;
    rot1[1][1] = cosTheta;
    
    float time = mod(iTime,3.5);
    
   	float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, 0.0);
    
    float step = 0.5;
    if (time < step) {
        // rotate colors clockwise
        // Green goes from left to top
        mat2 rot;
        float scale = 2.0 * PI / 3.0 / step;
        theta = - time * scale - PI/6.0;

        // cosTheta, sinTheta;
        cosTheta = cos(theta);
        sinTheta = sin(theta);
        rot[0][0] = cosTheta;
        rot[0][1] = -sinTheta;
        rot[1][0] = sinTheta;
        rot[1][1] = cosTheta;
        
        vec2 sPtRot = rot * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(PURPLE, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PINK, 1.0);   
        } else {
            fragColor = vec4(GREEN, 1.0);
        }
        
		float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0,0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        
        return;        
    } else if (time < step * 2.0) {
        // keeps cube with green on top for a bit
        vec2 sPtRot = rot1 * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(GREEN, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PURPLE, 1.0);   
        } else {
            fragColor = vec4(PINK, 1.0);
        }
        
        
        float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0,0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        
        return;   
    } else if (time < step * 3.0) {
        // TODO!!!!!
        // rotate cube about y axis
        
        float thetaY = - (time - step * 2.0) * 90.0 / step;
        
       	float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, thetaY, 0.0);
        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        
        float dist2 = shortestDistanceToSurface(eye, c_dir, MIN_DIST, MAX_DIST, thetaY, 0.0);
        
        vec3 p = eye + c_dir * dist2;
    	vec3 normal = (estimateNormal(p, thetaY, 0.0));
        float pink = normal.x - normal.z;
        float purple = normal.z - normal.x;
        
        vec3 color = GREEN;
        if (normal.y > 0.0) {
            fragColor = vec4(color, 1.0);
         	return;   
        }
        if (thetaY > -45.0) {
            if (purple > 0.0) {
             	color = PINK;   
            } else {
             	color = PURPLE;   
            }
        } else {
            if (purple > 0.0) {
             	color = PURPLE; 
            } else {
             	color = PINK;   
            }
        }
        
       	fragColor = vec4(color, 1.0);
        return;
    } else if (time < step * 3.5 ) {
        // keeps cube with green on top, pink and then purple        
        vec2 sPtRot = rot1 * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(GREEN, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PINK, 1.0);   
        } else {
            fragColor = vec4(PURPLE, 1.0);
        }
        
        float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, 0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        return;   
    } else if ( time < step * 4.5) {
        // SPIN COLORS COUNTER CLOCKWISE!!
      	mat2 rot;
        float scale = 2.0 * PI / 3.0 / step;
        theta = (time  - step * 3.5) * scale - PI/6.0;

        // cosTheta, sinTheta;
        cosTheta = cos(theta);
        sinTheta = sin(theta);
        rot[0][0] = cosTheta;
        rot[0][1] = -sinTheta;
        rot[1][0] = sinTheta;
        rot[1][1] = cosTheta;
        
        vec2 sPtRot = rot * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(GREEN, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PINK, 1.0);   
        } else {
            fragColor = vec4(PURPLE, 1.0);
        }
        
		float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, 0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        
        return;        
             
    } else if (time < step * 5.0) {
        // keeps cube with pink on top, purple and then pink
        vec2 sPtRot = rot1 * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(PINK, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PURPLE, 1.0);   
        } else {
            fragColor = vec4(GREEN, 1.0);
        }
        
        float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, 0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        return;  
    } else if (time < step * 6.0) {
        // ROTATE Z
        
        float thetaZ = (time - step * 5.0) * 90.0 / step;
        
       	float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, thetaZ);
        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        
        float dist2 = shortestDistanceToSurface(eye, c_dir, MIN_DIST, MAX_DIST, 0.0, thetaZ);
        
        vec3 p = eye + c_dir * dist2;
    	vec3 normal = (estimateNormal(p, 0.0, thetaZ));
        float pink = normal.x - normal.y;
        float purple = normal.y - normal.x;
        
        vec3 color = GREEN;
        if (normal.z > 0.0) {
            fragColor = vec4(color, 1.0);
         	return;   
        }
        if (thetaZ < 45.0) {
            if (purple > 0.0) {
             	color = PINK;   
            } else {
             	color = PURPLE;   
            }
        } else {
            if (purple > 0.0) {
             	color = PURPLE; 
            } else {
             	color = PINK;   
            }
        }
        
       	fragColor = vec4(color, 1.0);
        return;
        
    } else {
        // keeps cube with green on top, pink and then purple
        vec2 sPtRot = rot1 * srcPt;
    
  		float angle = 1.0 - (atan(sPtRot.y, sPtRot.x) / 6.28 + 0.5);
    
        if (angle < 0.3333333) {
         	fragColor = vec4(PURPLE, 1.0);
        } else if (angle < 0.6666666) {
         	fragColor = vec4(PINK, 1.0);   
        } else {
            fragColor = vec4(GREEN, 1.0);
        }
        
        float dist = shortestDistanceToSurface(eye, r_dir, MIN_DIST, MAX_DIST, 0.0, 0.0);

        if (dist > MAX_DIST - EPSILON) {
            // Didn't hit anything
            fragColor = vec4(250.0/255.0, 250.0/255.0, 250.0/ 255.0, 1.0);
            return;
        }
        return;  
    }
    
    vec3 p = c_pos + c_dir * dist;
    vec3 normal = estimateNormal(p, 0.0, 0.0);
    
    // Time varying pixel color
    // vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    
    vec3 color = normal.x * PINK + normal.y * PURPLE + normal.z * GREEN;

    // Output to screen
    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}