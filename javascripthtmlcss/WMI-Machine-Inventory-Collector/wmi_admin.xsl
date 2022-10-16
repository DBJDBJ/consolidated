<?xml version='1.0'?>
  <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>

  <xsl:template match="/">
    <html>
    <style>
      body {font-family:Arial; font-size:14px}
      h1   {margin-bottom:5px;}
      h3   {margin-bottom:0px;}
    </style>
    <body>
      <h3>&copy; by <a href="https://dbj.systems" target="_blank">DBJ.Systems Ltd</a></h3>
      <center>

      <xsl:apply-templates/>

    </center></body></html>
  </xsl:template>

  <xsl:template match="Root">
    <xsl:for-each select="./*">
      <h1><xsl:value-of select="name()"/></h1>

      <xsl:choose>
        <xsl:when test="name()='Metadata'">
          <table border="0" margin="0" padding="0" width="750px">
            <xsl:for-each select="*">
              <tr>
                <td align="right" bgcolor="#EEEEEE" width="50%"><xsl:value-of select="name()"/>&#xA0;&#xA0;</td>
                <td bgcolor="#DDDDDD">&#xA0;&#xA0;<xsl:value-of select="text()"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </xsl:when>
        <xsl:otherwise>

        <xsl:for-each select="*">
          <table border="0" margin="0" padding="0" width="750px">
            <tr><td>
              <xsl:choose>
                <xsl:when test="name()='Item'">
                  <xsl:attribute name="align">center</xsl:attribute>
                  <xsl:attribute name="colspan">2</xsl:attribute>
                  <xsl:attribute name="style">color:#800000</xsl:attribute>
                  <xsl:if test="@name">
                    <h3><xsl:value-of select="@name"/></h3>
                  </xsl:if>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="name()"/>
                </xsl:otherwise>
              </xsl:choose>
            </td></tr>

            <xsl:for-each select="./*">
              <tr><td>
                <xsl:choose>
                  <xsl:when test="not(text())">
                    <xsl:attribute name="align">center</xsl:attribute>
                      <xsl:attribute name="colspan">2</xsl:attribute>
                      <xsl:attribute name="style">color:#800000</xsl:attribute>
                      <xsl:if test="position()!=1 and count(parent::*/child::*[not(text())])&gt;1"><br/></xsl:if>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:attribute name="width">50%</xsl:attribute>
                      <xsl:attribute name="align">right</xsl:attribute>
                      <xsl:attribute name="bgcolor">#EEEEEE</xsl:attribute>
                    </xsl:otherwise>
                  </xsl:choose>
                  <xsl:choose>
                    <xsl:when test="@name"><xsl:value-of select="@name"/></xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="name()"/>
                    </xsl:otherwise>
                  </xsl:choose>
                  <xsl:if test="text()">&#xA0;&#xA0;</xsl:if>
                </td>
                <xsl:if test="text()">
                  <td bgcolor="#DDDDDD">&#xA0;&#xA0;<xsl:value-of select="text()"/></td>
                </xsl:if>
              </tr>

                <!-- The following constructions involving 'hr' and 'br' are designed
                     primarily for network adapters, that have deeply nested ip info -->
                <xsl:for-each select="./*">
                  <tr><td>
                    <xsl:choose>
                      <xsl:when test="not(text())">
                        <xsl:attribute name="align">center</xsl:attribute>
                        <xsl:attribute name="colspan">2</xsl:attribute>
                        <xsl:attribute name="style">text-decoration:underline</xsl:attribute>
                        <xsl:attribute name="bgcolor">#F5F5F5</xsl:attribute>

                        <xsl:if test="name()='Configuration'"><hr noshade="true" color="#DADADA" width="50%"/></xsl:if>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:attribute name="width">50%</xsl:attribute>
                        <xsl:attribute name="align">right</xsl:attribute>
                        <xsl:attribute name="bgcolor">#EEEEEE</xsl:attribute>
                      </xsl:otherwise>
                    </xsl:choose>

                    <xsl:choose>
                      <xsl:when test="@name">
                        <xsl:value-of select="@name"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="name()"/>
                      </xsl:otherwise>
                    </xsl:choose>
                    <xsl:if test="text()">&#xA0;&#xA0;</xsl:if>
                  </td>
                  <xsl:if test="text()"><td bgcolor="#DDDDDD">&#xA0;&#xA0;<xsl:value-of select="text()"/></td></xsl:if></tr>

                  <xsl:for-each select="./*">
                    <tr><td>
                      <xsl:choose>
                        <xsl:when test="not(text())">
                          <xsl:attribute name="align">center</xsl:attribute>
                          <xsl:attribute name="colspan">2</xsl:attribute>
                          <xsl:attribute name="bgcolor">#F0F0F0</xsl:attribute>
                          <br/>
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:attribute name="width">50%</xsl:attribute>
                          <xsl:attribute name="align">right</xsl:attribute>
                          <xsl:attribute name="bgcolor">#DEDEDE</xsl:attribute>
                        </xsl:otherwise>
                      </xsl:choose>

                      <xsl:choose>
                        <xsl:when test="@name">
                          <xsl:value-of select="@name"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="name()"/>
                        </xsl:otherwise>
                      </xsl:choose>
                      <xsl:if test="text()">&#xA0;&#xA0;</xsl:if>
                    </td>

                    <xsl:if test="text()"><td bgcolor="#CDCDCD">&#xA0;&#xA0;<xsl:value-of select="text()"/></td></xsl:if></tr>

                    <xsl:for-each select="./*">
                      <tr><td align="right" bgcolor="#DEDEDE">
                        <xsl:choose>
                          <xsl:when test="@name">
                            <xsl:value-of select="@name"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:value-of select="name()"/>
                          </xsl:otherwise>
                        </xsl:choose>
                        <xsl:if test="text()">&#xA0;&#xA0;</xsl:if>
                      </td>
                      <xsl:if test="text()"><td bgcolor="#CDCDCD">&#xA0;&#xA0;<xsl:value-of select="text()"/></td></xsl:if></tr>

                      <xsl:if test="position()=last()"><tr><td bgcolor="#F0F0F0" colspan="2"><br/></td></tr></xsl:if>
                    </xsl:for-each>
                  </xsl:for-each>
                  <xsl:if test="name()='Configuration'"><tr><td bgcolor="#F0F0F0" colspan="2"><hr noshade="true" color="#DADADA" width="50%"/></td></tr></xsl:if>
                </xsl:for-each>
              </xsl:for-each>
            </table><br/>
          </xsl:for-each>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>