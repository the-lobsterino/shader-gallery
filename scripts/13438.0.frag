#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
      // 
      // Setup scene and calculate associated normal map.
      // 
      
      highp vec3 spherePosition = vec3 (resolution.x * 0.5, resolution.y * 0.5, 0.0);
      
      highp float sphereRadius = min (resolution.x, resolution.y) * 0.5;
      
      highp float distanceFromSphere = length (spherePosition.xy - gl_FragCoord.xy);
      
      highp vec3 surfacePosition = vec3 (gl_FragCoord.xy, 0.0);
      
      highp vec3 surfaceNormal = vec3 (0.5, 0.5, 0.5);
      
      if (distanceFromSphere < sphereRadius)
      {
        surfacePosition.z = sqrt ((sphereRadius * sphereRadius) - (distanceFromSphere * distanceFromSphere));
        
        surfaceNormal = (surfacePosition - spherePosition) / sphereRadius;
      }
      
      // 
      // Lighting - diffuse and specular.
      // 
      
      highp vec3 viewDirection = vec3 (0.0, 0.0, -1.0);
      
      highp vec3 cumulativeLightColour = vec3 (0.0, 0.0, 0.0);
      
      for (int i = 0; i < 3; ++i)
      {
	highp vec3 lightColour = vec3 ((i == 0) ? 1.0 : 0.0, (i == 1) ? 1.0 : 0.0, (i == 2) ? 1.0 : 0.0);
	      
        highp vec3 lightPosition = vec3 ((i == 0) ? -(sphereRadius * sphereRadius) : (i == 1) ? (sphereRadius * sphereRadius) : spherePosition.x, spherePosition.y, (sphereRadius * sphereRadius));
        
        highp vec3 lightDirection = normalize (lightPosition - surfacePosition);
        
        highp float diffuseIntensity = max (dot (surfaceNormal, lightDirection), 0.0);
        
        cumulativeLightColour += lightColour * clamp (diffuseIntensity, 0.0, 1.0);
        
        highp float specularIntensity = max (dot (-reflect (surfaceNormal, lightDirection), -viewDirection), 0.0);
        
        cumulativeLightColour += vec3 (0.25, 0.25, 0.25) * clamp (pow (specularIntensity, 8.0), 0.0, 1.0);
      }
	
      gl_FragColor.xyzw = vec4 (cumulativeLightColour, 0.8);
}