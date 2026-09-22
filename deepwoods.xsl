<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <!-- Plantilla principal -->
    <xsl:template match="/">
        <div class="row">
            <xsl:for-each select="deepwoods/article">
                <div class="col-md-6 mb-4">
                    <div class="card h-100 p-3" style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(229, 228, 226, 0.2); color: #fff;">
                        <span class="badge badge-info w-25 mb-2">
                            <xsl:value-of select="tag"/>
                        </span>
                        <h3 class="font-cinzel h4">
                            <xsl:value-of select="titel"/>
                        </h3>
                        <h4 class="h6 text-muted mb-3">
                            <xsl:value-of select="untertitel"/>
                        </h4>
                        <p>
                            <xsl:value-of select="text"/>
                        </p>
                        <small class="text-muted">Kategorie: <xsl:value-of select="kategorie"/></small>
                    </div>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>