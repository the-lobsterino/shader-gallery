// spunky splat
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float line( vec2 a, vec2 b, vec2 p )
{
    vec2 aTob = b - a;
    vec2 aTop = p - a;

    float t = dot( aTop, aTob ) / dot( aTob, aTob);

    t = clamp( t, 0.0, 1.0);

    float d = length( p - (a + aTob * t) );
    d = 0.15 / d;

    d = pow(d, 1.3);
    return clamp( d, 0.0, 1.0 );
}

mat4 perspectiveMatrix(float fovYInRad, float aspectRatio)
{    
    float yScale = 1.0/tan(fovYInRad / 2.0);
    float xScale = yScale / aspectRatio;  
    float zf = 100.0;
    float zn = 0.3;
    
    float z1 = zf/(zf-zn);
    float z2 = -zn*zf/(zf-zn);

    mat4 result = mat4(xScale, 0.0, 0.0, 0.0,
              0.0, yScale, 0.0, 0.0,
              0.0, 0.0, z1, z2,
              0.0, 0.0, -1.0, 0.0);
    
    return result;
}

mat4 translationMatrix(vec3 pos)
{
    mat4 result = 
    mat4(1.0, 0.0, 0.0, 0.0, 
         0.0, 1.0, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         pos.x, pos.y, pos.z, 1.0 );
    
    return result;
}

mat4 rotXMatrix(float theta)
{
    float cs = cos(theta);
    float ss = sin(theta);

    mat4 result = 
    mat4(1.0, 0.0, 0.0, 0.0, 
         0.0, cs, -ss, 0.0,
         0.0, ss, cs, 0.0,
         0.0, 0.0, 0.0, 1.0 );

    return result;
}

mat4 rotYMatrix(float theta)
{
    float cs = cos(theta);
    float ss = sin(theta);

    mat4 result = 
    mat4(cs, 0.0, -ss, 0.0, 
         0.0, 1.0, 0.0, 0.0,
         ss, 0.0, cs, 0.0,
         0.0, 0.0, 0.0, 1.0 );

    return result;
}

float line2(mat4 mvp, vec4 a, vec4 b, vec2 uv) {
        vec4 startWorldVert = mvp * a;
        vec4 endWorldVert = mvp * b;
        vec2 sp = startWorldVert.xy / startWorldVert.w;
        vec2 ep = endWorldVert.xy / endWorldVert.w;
	return line(sp, ep, uv);
}

void main( void )
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

    uv *= 4.0;

    const float fovYInRad = (45.0/180.0) * 3.14159;
    float aspectRatio = resolution.x / resolution.y;

    const float vs = 10.0;
    #define maxVerts 4

    float moveX = mix(10.0, -10.0, sin(time * 0.4) * 0.5 + 0.5) *0.0;
    float moveY = mix(10.0, -10.0, sin(time * 0.2) * 0.5 + 0.5)*0.0;
    float moveZ = mix(40.0, 60.0, sin(time * 0.2) * 0.5 + 0.5)*0.0 + 50.0;

    vec3 pos = vec3( moveX, moveY, moveZ);
    mat4 rotY = rotYMatrix(time*0.0) * rotXMatrix(time * 0.0);

    mat4 worldMat = translationMatrix(pos) * rotY;
    mat4 perspective = perspectiveMatrix(fovYInRad, aspectRatio);

	vec4 head = vec4(-0.5, -14.0, 0.0, 1.0);
	vec4 head2 = vec4(-2.0, -17.0, 0.0, 1.0);
	vec4 neck = vec4(0.0, -5.0, 0.0, 1.0);
	vec4 leftHand = vec4(-9.0, -4.0, 0.0, 1.0);
	vec4 rightHand = vec4(11.0, -6.0, 0.0, 1.0);
	vec4 pelvis = vec4(0.5, 5.0, 0.0, 1.0);
	vec4 leftFoot = vec4(-11.0, 9.0, 0.0, 1.0);
	vec4 rightFoot = vec4(9.0, 11.0, 0.0, 1.0);
	
    mat4 mvp = perspective * worldMat;

    float t = 0.0;

     t += line2(mvp, head, head2, uv);
     t += line2(mvp, head, neck, uv);
     t += line2(mvp, leftHand, neck, uv);
     t += line2(mvp, rightHand, neck, uv);
     t += line2(mvp, neck, pelvis, uv);
     t += line2(mvp, leftFoot, pelvis, uv);
     t += line2(mvp, rightFoot, pelvis, uv);

	
    vec3 fc = vec3( 0.00 );
  //  fc += vec3(pow(abs(uv.y / 10.0), 2.5));

    fc += vec3( 1.5, 2.5, 8.0 ) * pow(t, 2.1);


    gl_FragColor = vec4( fc, 1.0 );
}