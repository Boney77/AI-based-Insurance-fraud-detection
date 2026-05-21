@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MVN_CMD=mvn.cmd") ELSE (SET "MVN_CMD=%__MVNW_ARG0_NAME__%")
@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@SET JAVA_HOME_PARENT=%JAVA_HOME%
@IF NOT DEFINED JAVA_HOME (
    @FOR /F "usebackq tokens=*" %%A IN (`where java`) DO @SET "JAVA_CMD=%%A" & GOTO found_java
    @ECHO Error: JAVA_HOME not set and no java found in PATH.
    @EXIT /B 1
    :found_java
) ELSE (
    @SET "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
)

@IF NOT EXIST %WRAPPER_JAR% (
    @ECHO Downloading Maven Wrapper...
    @"%JAVA_CMD%" -classpath %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperDownloader "%DOWNLOAD_URL%" %WRAPPER_JAR% 2>NUL
    @IF ERRORLEVEL 1 powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%WRAPPER_JAR%'"
)

@"%JAVA_CMD%" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
